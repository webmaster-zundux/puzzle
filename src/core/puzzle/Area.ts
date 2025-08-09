import { getRandomIntWithinRange } from "../../utils/getRandomIntWithinRange";
import { BaseEntity } from "./BaseEntity";
import { Point } from "./Point";

export const getRandomPointWithinArea = (area: Area): Point => {
  const p0 = new Point(area.x, area.y);
  const p2 = new Point(area.x + area.width - 1, area.y + area.height - 1);

  const x = getRandomIntWithinRange(p0.x, p2.x);
  const y = getRandomIntWithinRange(p0.y, p2.y);
  const newPosition = new Point(x, y);

  return newPosition;
};

let areaIndex = 0;
export const generateAreaId = () => {
  areaIndex++;
  return `area_${areaIndex}`;
};

export class Area extends BaseEntity {
  constructor(
    public x = 0,
    public y = 0,
    public width = 1,
    public height = 1,
    id?: string,
  ) {
    const areaId = id ? id : generateAreaId();
    super({ id: areaId });
  }

  public static create({
    x = 0,
    y = 0,
    width = 1,
    height = 1,
    id,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    id?: string;
  }) {
    return new Area(x, y, width, height, id);
  }

  static getBoundaryCornerPoints(areaCenterPoint: Point, areaSideSize: number): { p0: Point; p2: Point } {
    if (typeof areaCenterPoint !== "object" || !(areaCenterPoint instanceof Point)) {
      throw new Error("Error. Parameter areaCenterPoint should be an instance of Point");
    }

    if (typeof areaSideSize !== "number" || !Number.isFinite(areaSideSize)) {
      throw new Error("Error. Parameter areaCenterPoint should be a finite number");
    }

    const cx = areaCenterPoint.x;
    const cy = areaCenterPoint.y;
    const areaHalfSideSize = areaSideSize / 2;

    const p0 = new Point(cx - areaHalfSideSize, cy - areaHalfSideSize);
    const p2 = new Point(cx + areaHalfSideSize, cy + areaHalfSideSize);

    return { p0, p2 };
  }
}
