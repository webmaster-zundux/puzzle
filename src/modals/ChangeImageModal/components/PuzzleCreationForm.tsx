import type { ChangeEvent, FC, FormEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { ModalActionButton } from "../../../components/ModalActionButton";
import { NumberOfPiecesButton } from "../../../components/NumberOfPiecesButton";
import { ShapeNameRadioOption } from "../../../components/ShapeNameRadioOption";
import { Spacer } from "../../../components/SidePanelComponents/Spacer";
import { useHtmlElementResize } from "../../../hooks/useElementResize";
import { usePuzzleInformation, usePuzzleInformationDispatch } from "../../../hooks/usePuzzleInformation";
import type { BoundaryPoints } from "../../../models/BoundaryPoints";
import { Point } from "../../../models/Point";
import type { PuzzleSize } from "../../../models/PuzzleSize";
import {
  AVAILABLE_SIZES_OF_PUZZLE_IN_PIECES_PER_SIDES,
  DEFAULT_SIZE_OF_PUZZLE_IN_PIECES_PER_SIDES,
} from "../../../models/PuzzleSize";
import type { PieceShapeName } from "../../../utils-path/getSideShapes";
import { DEFAULT_PIECE_SHAPE_NAME, USER_AVAILABLE_SIDE_SHAPE_NAMES } from "../../../utils-path/getSideShapes";
import { cn } from "../../../utils/cssClassNames";
import { useInitialSelectedAreaIfImageSrcIsTheSame } from "../hooks/useInitialPuzzleParams";
import { useLoadImageForPreview } from "../hooks/useLoadImageForPreview";
import { useScrollBorders } from "../hooks/useScrollBorders";
import { useSelectedZoneBoundaryPoints } from "../hooks/useSelectedZoneBoundaryPoints";
import { useTextSelectionIsolation } from "../hooks/useTextSelectionIsolation";
import { PuzzleCreationAdditionalInfo } from "./PuzzleCreationAdditionalInfo";
import s from "./PuzzleCreationForm.module.css";
import { SelectedZone } from "./SelectZone";
import { useToggleVisibility } from "../../../hooks/useToggleVisibility";

const MINIMAL_NUMBER_OF_PIECES = 2;

export const DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX = 50;

const PORTRAIT_ORIENTATION_RATIO = 0.9;

const PUZZLE_PREVIEW_ALT_TEXT = "preview of the puzzle cut into pieces";

interface PuzzleCreationFormProps {
  imageSrc?: string;
  onHideModal: () => void;
  onSwitchToModeChooseMethod: () => void;
}

export const PuzzleCreationForm: FC<PuzzleCreationFormProps> = ({
  imageSrc,
  onHideModal,
  onSwitchToModeChooseMethod,
}) => {
  const {
    pieceSideShapeName: initialPieceSideShapeName,
    numberOfPiecesPerWidth: initialNumberOfPiecesPerWidth,
    numberOfPiecesPerHeight: initialNumberOfPiecesPerHeight,
  } = usePuzzleInformation();

  const [selectedShapeName, setSelectedShapeName] = useState<PieceShapeName>(
    initialPieceSideShapeName || DEFAULT_PIECE_SHAPE_NAME,
  );
  const [chosenSize, setChosenSize] = useState<PuzzleSize>(
    [initialNumberOfPiecesPerWidth, initialNumberOfPiecesPerHeight] || DEFAULT_SIZE_OF_PUZZLE_IN_PIECES_PER_SIDES,
  );

  const [numberPiecesPerWidth = 1, numberPiecesPerHeight = 1] = useMemo(() => chosenSize, [chosenSize]);

  const handleSetPieceShape = useCallback((shapeName: PieceShapeName) => {
    setSelectedShapeName(shapeName);
  }, []);

  const handleChangeNumberPerWidth = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newNumberPiecesPerWidth = Number.parseInt(event.target.value, 10);
      if (Number.isFinite(newNumberPiecesPerWidth) && newNumberPiecesPerWidth >= 1) {
        setChosenSize([newNumberPiecesPerWidth, numberPiecesPerHeight]);
        return;
      }

      setChosenSize([1, numberPiecesPerHeight]);
    },
    [numberPiecesPerHeight, setChosenSize],
  );

  const handleChangeNumberPerheight = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newNumberPiecesPerHeight = Number.parseInt(event.target.value, 10);
      if (Number.isFinite(newNumberPiecesPerHeight) && newNumberPiecesPerHeight >= 1) {
        setChosenSize([numberPiecesPerWidth, newNumberPiecesPerHeight]);
        return;
      }

      setChosenSize([numberPiecesPerWidth, 1]);
    },
    [numberPiecesPerWidth, setChosenSize],
  );

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { elementWidth: imageContainerElementWidth, elementHeight: imageContainerElementHeight } =
    useHtmlElementResize(imageContainerRef);

  const { controlPoints, dispatchZoneControlPointsChange } = useSelectedZoneBoundaryPoints({ imageContainerRef });

  const imageContainerWidth = useMemo(() => {
    return imageContainerElementWidth > 1 ? imageContainerElementWidth : 0;
  }, [imageContainerElementWidth]);

  const imageContainerHeight = useMemo(() => {
    return imageContainerElementHeight > 1 ? imageContainerElementHeight : 0;
  }, [imageContainerElementHeight]);

  const { image, imageWidth, imageHeight } = useLoadImageForPreview({ imageSrc });

  const pieceMinimalSideSizeInSelectionZoneScale = useMemo(() => {
    if (imageWidth < 1 || imageContainerWidth < 1) {
      return DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX;
    }

    const scale = imageWidth / imageContainerWidth;

    return DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX / scale;
  }, [imageWidth, imageContainerWidth]);

  const [possibleNumberPerWidth, setPossibleNumberPerWidth] = useState(numberPiecesPerWidth);
  const [possibleNumberPerHeight, setPossibleNumberPerHeight] = useState(numberPiecesPerHeight);
  const [pieceSideSize, setPieceSideSize] = useState(1);

  const imageScale = imageContainerWidth > 0 ? imageWidth / imageContainerWidth : 1;
  const pieceSideSizeInImageScale = pieceSideSize * imageScale;

  const handleChangeNumberOfPieces = useCallback(
    (itemsPerWidth: number, itemsPerHeight: number, sideSize: number) => {
      setPossibleNumberPerWidth(itemsPerWidth);
      setPossibleNumberPerHeight(itemsPerHeight);
      setPieceSideSize(sideSize);
    },
    [setPossibleNumberPerWidth, setPossibleNumberPerHeight, setPieceSideSize],
  );

  const handleTextSelectionMode = useTextSelectionIsolation(imageContainerRef);

  const isImageDisplayed = imageWidth > 1 && imageHeight > 1 && imageContainerWidth > 1 && imageContainerHeight > 1;

  useInitialSelectedAreaIfImageSrcIsTheSame({
    imageSrc,
    isImageDisplayed,
    dispatchZoneControlPointsChange,
    imageScale,
  });

  const handleResetSelectedZone = useCallback(() => {
    dispatchZoneControlPointsChange({
      type: "set",
      tl: new Point(0, 0),
      br: new Point(imageContainerElementWidth, imageContainerElementHeight),
    });
  }, [dispatchZoneControlPointsChange, imageContainerElementWidth, imageContainerElementHeight]);

  const imageSidesRatio = imageWidth / imageHeight;
  const isImageInPortraitOrientation = imageSidesRatio <= PORTRAIT_ORIENTATION_RATIO;
  const numberOfPieces = possibleNumberPerWidth * possibleNumberPerHeight;

  const isDisabledPuzzleCreationButton: boolean = !(
    Boolean(imageSrc) &&
    Boolean(selectedShapeName) &&
    Boolean(chosenSize) &&
    isImageDisplayed &&
    numberOfPieces >= MINIMAL_NUMBER_OF_PIECES
  );

  const puzzleInformationDispatch = usePuzzleInformationDispatch();

  const handleCreatePuzzle = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isDisabledPuzzleCreationButton) {
        return;
      }

      const imageBoundaryPoints: BoundaryPoints = {
        tl: new Point(controlPoints.tl.x * imageScale, controlPoints.tl.y * imageScale),
        br: new Point(controlPoints.br.x * imageScale, controlPoints.br.y * imageScale),
      };

      const textureWidth = possibleNumberPerWidth * (pieceSideSize * imageScale);
      const textureHeight = possibleNumberPerHeight * (pieceSideSize * imageScale);
      const textureBoundaryPoints: BoundaryPoints = {
        tl: imageBoundaryPoints.tl,
        br: new Point(imageBoundaryPoints.tl.x + textureWidth, imageBoundaryPoints.tl.y + textureHeight),
      };

      const imageOriginalSize = {
        width: imageWidth,
        height: imageHeight,
      };

      puzzleInformationDispatch({
        type: "init-new-challenge-id",
        params: {
          imageSrc,
          imageOriginalSize,
          pieceSideShapeName: selectedShapeName,
          numberOfPiecesPerWidth: possibleNumberPerWidth,
          numberOfPiecesPerHeight: possibleNumberPerHeight,
          boundaryPoints: textureBoundaryPoints,
        },
      });

      onHideModal();
    },
    [
      isDisabledPuzzleCreationButton,
      imageSrc,
      selectedShapeName,
      imageWidth,
      imageHeight,
      imageScale,
      possibleNumberPerWidth,
      possibleNumberPerHeight,
      pieceSideSize,
      controlPoints.tl.x,
      controlPoints.tl.y,
      controlPoints.br.x,
      controlPoints.br.y,
      puzzleInformationDispatch,
      onHideModal,
    ],
  );

  const contentElementRef = useRef(null);
  const { showTopBorder, showBottomBorder } = useScrollBorders(contentElementRef);

  const {
    isVisible: isVisibleFullSizeImage,
    show: handleShowImageInFullSize,
    hide: handleShowImageInSmallSize,
  } = useToggleVisibility(false);

  return (
    <form ref={formRef} className={s.PreviewContainer} onSubmit={handleCreatePuzzle}>
      <div
        className={cn([
          s.PreviewContent,
          showTopBorder && s.VisibleTopBorder,
          showBottomBorder && s.VisibleBottomBorder,
        ])}
        ref={contentElementRef}
      >
        <div className={s.SelectedZoneContainer}>
          <div ref={imageContainerRef} className={cn([s.ImageContainer, isVisibleFullSizeImage && s.FitContent])}>
            {image?.src && (
              <>
                <img src={image.src} alt={PUZZLE_PREVIEW_ALT_TEXT} className={s.ImagePreview} />

                {isImageDisplayed && (
                  <SelectedZone
                    title={PUZZLE_PREVIEW_ALT_TEXT}
                    numberPiecesPerWidth={numberPiecesPerWidth}
                    numberPiecesPerHeight={numberPiecesPerHeight}
                    imageWidth={imageContainerWidth}
                    imageHeight={imageContainerHeight}
                    controlPoints={controlPoints}
                    pieceMinimalSideSizeInSelectionZoneScale={pieceMinimalSideSizeInSelectionZoneScale}
                    onDispatchZoneControlPointsChange={dispatchZoneControlPointsChange}
                    onChangeNumberOfPieces={handleChangeNumberOfPieces}
                    onControlPointSelected={handleTextSelectionMode}
                  />
                )}
              </>
            )}
          </div>

          {!isImageInPortraitOrientation && (
            <PuzzleCreationAdditionalInfo
              pieceSideSize={pieceSideSizeInImageScale}
              pieceMinimalSideSizeInImageScale={DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
            />
          )}
        </div>

        <div className={s.AttributesPanel}>
          <div className={s.FormFieldList}>
            <div className={s.FormField}>
              <h2 className={s.FormFieldName}>Piece shape</h2>
              <ul className={s.Shapes} aria-label="available shapes">
                {USER_AVAILABLE_SIDE_SHAPE_NAMES.map((shapeName) => (
                  <ShapeNameRadioOption
                    key={shapeName}
                    value={shapeName}
                    checked={shapeName === selectedShapeName}
                    onChange={handleSetPieceShape}
                  />
                ))}
              </ul>
            </div>

            <div className={s.FormField}>
              <h2 className={s.FormFieldName}>Minimal number of pieces per side</h2>

              <div className={s.FormFieldInline}>
                <div className={s.FormFieldinlineGroup}>
                  <div className={s.FormSubField}>
                    <input
                      type="number"
                      id="numberPerWidth"
                      name="numberPerWidth"
                      className={s.FormFieldInput}
                      value={String(numberPiecesPerWidth)}
                      onChange={handleChangeNumberPerWidth}
                    />
                    <label className={s.FormSubFieldName} htmlFor="numberPerWidth">
                      width
                    </label>
                  </div>

                  <div className={s.FormSubField}>
                    <input
                      type="number"
                      id="numberPerHeight"
                      name="numberPerHeight"
                      className={s.FormFieldInput}
                      value={String(numberPiecesPerHeight)}
                      onChange={handleChangeNumberPerheight}
                    />
                    <label className={s.FormSubFieldName} htmlFor="numberPerHeight">
                      height
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className={s.FormField}>
              <h2 className={s.FormFieldName}>Recommended number of pieces</h2>
              <ul className={s.SizeList} aria-label="recommended sizes">
                {AVAILABLE_SIZES_OF_PUZZLE_IN_PIECES_PER_SIDES.map((size) => (
                  <li key={size.join("-")} className={s.SizeListItem}>
                    <NumberOfPiecesButton
                      size={size}
                      onSizeChange={setChosenSize}
                      isActive={size[0] === chosenSize[0] && size[1] === chosenSize[1]}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Spacer />

          {isImageInPortraitOrientation && (
            <PuzzleCreationAdditionalInfo
              pieceSideSize={pieceSideSizeInImageScale}
              pieceMinimalSideSizeInImageScale={DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
            />
          )}
        </div>
      </div>

      <div className={s.FormFooter}>
        <div className={s.TotalNumberOfPieces} role="note" aria-labelledby="total-number-of-pieces-label">
          <div className={s.TotalNumberOfPiecesLabel}>
            <span id="total-number-of-pieces-label">Total number of pieces:&nbsp;</span>
            {numberOfPieces}
          </div>
          <span>
            ({possibleNumberPerWidth}x{possibleNumberPerHeight})
          </span>
        </div>

        <div className={cn([s.FormActionButtons, s.WithButtonGroups])}>
          <div className={s.FormActionButtons}>
            {!isVisibleFullSizeImage && (
              <ModalActionButton onClick={handleShowImageInFullSize}>Show image in full size</ModalActionButton>
            )}
            {isVisibleFullSizeImage && (
              <ModalActionButton onClick={handleShowImageInSmallSize}>Show image in small size</ModalActionButton>
            )}

            <ModalActionButton onClick={handleResetSelectedZone}>Reset selected area</ModalActionButton>
          </div>

          <div className={s.FormActionButtons}>
            <ModalActionButton onClick={onSwitchToModeChooseMethod}>Use another image</ModalActionButton>

            <ModalActionButton isPrimary type="submit" disabled={isDisabledPuzzleCreationButton}>
              Create puzzle
            </ModalActionButton>
          </div>
        </div>
      </div>
    </form>
  );
};
