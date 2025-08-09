import { memo } from "react";
import { ReactSVG } from "react-svg";
import { cn } from "../utils/cssClassNames";
import s from "./Icon.module.css";

export type IconName =
  | "arrow-rotate-left"
  | "bars"
  | "clock-rotate-left"
  | "compress"
  | "ellipsis-vertical"
  | "expand"
  | "minus"
  | "pause"
  | "play"
  | "plus"
  | "xmark"
  | "globe";

export type IconSize = "double";

export interface IconProps {
  iconName?: IconName;
  size?: IconSize;
}

export const Icon = memo(function Icon({ iconName = "xmark", size, ...restProps }: IconProps) {
  const iconPath = `${import.meta.env.BASE_URL}assets/fa-icons/${iconName}.svg`;

  const className = cn([s.Icon, size === "double" && s.DoubleSize]);

  return <ReactSVG className={className} src={iconPath} {...restProps} />;
});
