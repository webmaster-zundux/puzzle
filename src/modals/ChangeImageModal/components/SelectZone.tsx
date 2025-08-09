import type { Dispatch, MouseEventHandler, TouchEventHandler } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BoundaryPoints } from "../../../models/BoundaryPoints";
import { Point } from "../../../models/Point";
import type { ZoneBoundaryPointsReducerAction } from "../hooks/useSelectedZoneBoundaryPoints";
import { useSelectZoneControlPoint } from "../hooks/useSelectZoneControlPoint";
import { CentralControlPoint } from "./CentralControlPoint";
import { CornerControlPoint } from "./CornerControlPoint";
import type { PieceBorderLine } from "./PieceBorder";
import { PieceBorder } from "./PieceBorder";
import s from "./SelectedZone.module.css";
import { SideControlPoint } from "./SideControlPoint";

const CONTROL_POINT_TOP_LEFT = "tl" as const;
const CONTROL_POINT_TOP = "t" as const;
const CONTROL_POINT_TOP_RIGHT = "tr" as const;
const CONTROL_POINT_LEFT = "l" as const;
const CONTROL_POINT_CENTER = "c" as const;
const CONTROL_POINT_RIGHT = "r" as const;
const CONTROL_POINT_BOTTOM_LEFT = "bl" as const;
const CONTROL_POINT_BOTTOM = "b" as const;
const CONTROL_POINT_BOTTOM_RIGHT = "br" as const;

const CONTROL_POINT_NAMES = [
  CONTROL_POINT_TOP_LEFT,
  CONTROL_POINT_TOP,
  CONTROL_POINT_TOP_RIGHT,
  CONTROL_POINT_LEFT,
  CONTROL_POINT_CENTER,
  CONTROL_POINT_RIGHT,
  CONTROL_POINT_BOTTOM_LEFT,
  CONTROL_POINT_BOTTOM,
  CONTROL_POINT_BOTTOM_RIGHT,
];

export type ControlPointName = (typeof CONTROL_POINT_NAMES)[number];

function getIsControlPointName(value: unknown): value is ControlPointName {
  return typeof value === "string" && CONTROL_POINT_NAMES.includes(value as ControlPointName);
}

interface SelectedZoneProps {
  title: string;
  numberPiecesPerWidth: number;
  numberPiecesPerHeight: number;
  imageWidth: number;
  imageHeight: number;
  controlPoints: BoundaryPoints;
  pieceMinimalSideSizeInSelectionZoneScale: number;
  onDispatchZoneControlPointsChange: Dispatch<ZoneBoundaryPointsReducerAction>;
  onChangeNumberOfPieces: (itemsPerWidth: number, itemsPerHeight: number, sideSize: number) => void;
  onControlPointSelected: (controlPointName?: ControlPointName) => void;
}

export const SelectedZone = memo(function SelectedZone({
  title,
  numberPiecesPerWidth = 1,
  numberPiecesPerHeight = 1,
  imageWidth = 1,
  imageHeight = 1,
  controlPoints,
  pieceMinimalSideSizeInSelectionZoneScale = 1,
  onDispatchZoneControlPointsChange,
  onChangeNumberOfPieces,
  onControlPointSelected,
}: SelectedZoneProps) {
  const [selectedControlPointName, setSelectedControlPointName] = useState<ControlPointName>();

  useEffect(() => {
    onControlPointSelected(selectedControlPointName);
  }, [onControlPointSelected, selectedControlPointName]);

  const selectControlPointByName = useCallback(
    function selectControlPoint(controlPointName: string | undefined) {
      if (!getIsControlPointName(controlPointName)) {
        console.error("trying to select a control point with unsupported name");
        return;
      }

      setSelectedControlPointName(controlPointName);
    },
    [setSelectedControlPointName],
  );

  const handleControlPointTouch = useCallback<TouchEventHandler<SVGElement>>(
    (event) => {
      selectControlPointByName((event.target as SVGElement)?.id);
    },
    [selectControlPointByName],
  );

  const handleControlPointClick = useCallback<MouseEventHandler<SVGElement>>(
    (event) => {
      selectControlPointByName((event.target as SVGElement)?.id);
    },
    [selectControlPointByName],
  );

  const { tl, br } = controlPoints;
  const zoneWidth = Math.floor(br.x - tl.x);
  const zoneHeight = Math.floor(br.y - tl.y);
  const zoneWidthHalf = zoneWidth / 2;
  const zoneHeightHalf = zoneHeight / 2;

  const t = new Point(tl.x + zoneWidthHalf, tl.y);
  const tr = new Point(br.x, tl.y);
  const r = new Point(br.x, tl.y + zoneHeightHalf);
  const b = new Point(tl.x + zoneWidthHalf, br.y);
  const bl = new Point(tl.x, br.y);
  const l = new Point(tl.x, tl.y + zoneHeightHalf);
  const c = new Point(tl.x + zoneWidthHalf, tl.y + zoneHeightHalf);

  const selectingZoneRef = useRef<SVGSVGElement>(null);
  useSelectZoneControlPoint({
    selectingZoneRef,
    imageWidth,
    imageHeight,
    selectedControlPointName,
    setSelectedControlPointName,
    tl,
    br,
    onDispatchZoneControlPointsChange,
  });

  const { possibleNumberPerWidth, possibleNumberPerHeight, sideSize } = useMemo(() => {
    let sideSize = pieceMinimalSideSizeInSelectionZoneScale;
    sideSize = Math.floor(zoneWidth / numberPiecesPerWidth);
    if (sideSize < pieceMinimalSideSizeInSelectionZoneScale) {
      sideSize = pieceMinimalSideSizeInSelectionZoneScale;
    }

    let possibleNumberPerWidth = Math.floor(zoneWidth / sideSize);
    let possibleNumberPerHeight = Math.floor(zoneHeight / sideSize);

    if (possibleNumberPerHeight <= numberPiecesPerHeight) {
      sideSize = Math.floor(zoneHeight / numberPiecesPerHeight);
      possibleNumberPerWidth = Math.floor(zoneWidth / sideSize);
      possibleNumberPerHeight = Math.floor(zoneHeight / sideSize);

      if (sideSize < pieceMinimalSideSizeInSelectionZoneScale) {
        sideSize = pieceMinimalSideSizeInSelectionZoneScale;
        possibleNumberPerWidth = Math.floor(zoneWidth / pieceMinimalSideSizeInSelectionZoneScale);
        possibleNumberPerHeight = Math.floor(zoneHeight / pieceMinimalSideSizeInSelectionZoneScale);
      }
    }

    return { possibleNumberPerWidth, possibleNumberPerHeight, sideSize };
  }, [pieceMinimalSideSizeInSelectionZoneScale, numberPiecesPerWidth, numberPiecesPerHeight, zoneWidth, zoneHeight]);

  const piecesArea = useMemo(() => {
    return {
      x: tl.x,
      y: tl.y,
      width: possibleNumberPerWidth * sideSize,
      height: possibleNumberPerHeight * sideSize,
    };
  }, [tl.x, tl.y, possibleNumberPerWidth, possibleNumberPerHeight, sideSize]);

  useEffect(() => {
    onChangeNumberOfPieces(possibleNumberPerWidth, possibleNumberPerHeight, sideSize);
  }, [onChangeNumberOfPieces, possibleNumberPerWidth, possibleNumberPerHeight, sideSize]);

  const verticalLines = useMemo(() => {
    const lines: PieceBorderLine[] = [];
    const y2 = tl.y + possibleNumberPerHeight * sideSize;
    for (let i = 0; i <= possibleNumberPerWidth; i++) {
      const x = tl.x + i * sideSize;
      lines.push({
        id: `v-${i}`,
        x1: x,
        y1: tl.y,
        x2: x,
        y2,
      });
    }
    return lines;
  }, [possibleNumberPerHeight, possibleNumberPerWidth, sideSize, tl.x, tl.y]);

  const horizontalLines = useMemo(() => {
    const lines: PieceBorderLine[] = [];
    const x2 = tl.x + possibleNumberPerWidth * sideSize;
    for (let j = 0; j <= possibleNumberPerHeight; j++) {
      const y = tl.y + j * sideSize;
      lines.push({
        id: `h-${j}`,
        x1: tl.x,
        y1: y,
        x2,
        y2: y,
      });
    }
    return lines;
  }, [possibleNumberPerHeight, possibleNumberPerWidth, sideSize, tl.x, tl.y]);

  if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight)) {
    return undefined;
  }

  if (!Number.isFinite(piecesArea.width) || !Number.isFinite(piecesArea.height)) {
    piecesArea;
    return undefined;
  }

  return (
    <svg
      ref={selectingZoneRef}
      className={s.SelectedZone}
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      role="application"
      aria-label={title}
    >
      <filter id="shadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1"></feDropShadow>
      </filter>

      <g role="img" aria-label="pieces borders">
        {verticalLines.map(({ id, x1, y1, x2, y2 }) => (
          <PieceBorder key={id} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
        {horizontalLines.map(({ id, x1, y1, x2, y2 }) => (
          <PieceBorder key={id} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>

      <rect
        x="0"
        y="0"
        width={imageWidth}
        height={imageHeight}
        mask="url(#selected-zone)"
        aria-label="available to select area of image"
      >
        <title>available to select area of image</title>
      </rect>
      <path
        d={`M${tl.x} ${tl.y}L${tr.x} ${tr.y}L${br.x} ${br.y}L${bl.x} ${bl.y}Z`}
        className={s.SelectedZoneBorder}
        style={{ filter: "url(#shadow)" }}
        role="img"
        aria-label="selected area border"
      />
      <mask id="selected-zone">
        <rect x={0} y={0} width={imageWidth} height={imageHeight} fill="white" />
        <rect x={piecesArea.x} y={piecesArea.y} width={piecesArea.width} height={piecesArea.height} fill="black">
          <title>selected area</title>
        </rect>
      </mask>

      <CentralControlPoint
        id="c"
        point={c}
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_CENTER}
      />

      <SideControlPoint
        id="t"
        point={t}
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_TOP}
      />
      <SideControlPoint
        id="r"
        point={r}
        vertical
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_RIGHT}
      />
      <SideControlPoint
        id="b"
        point={b}
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_BOTTOM}
      />
      <SideControlPoint
        id="l"
        point={l}
        vertical
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_LEFT}
      />

      <CornerControlPoint
        id="tl"
        point={tl}
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_TOP_LEFT}
      />
      <CornerControlPoint
        id="tr"
        point={tr}
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_TOP_RIGHT}
      />
      <CornerControlPoint
        id="br"
        point={br}
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_BOTTOM_RIGHT}
      />
      <CornerControlPoint
        id="bl"
        point={bl}
        onMouseDown={handleControlPointClick}
        onTouchStart={handleControlPointTouch}
        active={selectedControlPointName == CONTROL_POINT_BOTTOM_LEFT}
      />
    </svg>
  );
});
