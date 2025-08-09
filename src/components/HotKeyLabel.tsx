import type { FC, PropsWithChildren } from "react";
import s from "./HotKeyLabel.module.css";

export const HotKeyLabel: FC<PropsWithChildren> = ({ children }) => {
  return <span className={s.HotKeyLabel}>{children}</span>;
};
