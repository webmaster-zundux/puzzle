import { memo } from "react";
import s from "./Spacer.module.css";

export const Spacer = memo(function Spacer() {
  return <div className={s.Spacer}></div>;
});
