import type { CSSProperties, FC } from "react";
import s from "./PieceBorder.module.css";

interface PieceBorderProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  style?: CSSProperties;
}

export const PieceBorder: FC<PieceBorderProps> = ({ x1, y1, x2, y2, style }) => {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={s.PieceBorder} style={style} />;
};

export type PieceBorderLine = Pick<PieceBorderProps, "x1" | "y1" | "x2" | "y2"> & {
  id: string;
};
