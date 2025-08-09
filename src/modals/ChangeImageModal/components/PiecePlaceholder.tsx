import type { FC } from "react";
import s from "./PiecePlaceholder.module.css";

interface PiecePlaceholderProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PiecePlaceholder: FC<PiecePlaceholderProps> = ({ x, y, width = 1, height = 1 }) => {
  return <rect x={x} y={y} width={width} height={height} className={s.PiecePlaceholder} />;
};

export type PiecePlaceholderSquare = PiecePlaceholderProps & {
  id: string;
};
