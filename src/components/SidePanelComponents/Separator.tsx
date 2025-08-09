import { memo } from "react";
import s from "./Separator.module.css";

export const Separator = memo(function Separator() {
  return <hr className={s.Separator} />;
});
