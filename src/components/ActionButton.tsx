import type { ButtonHTMLAttributes, CSSProperties, DetailedHTMLProps, PropsWithChildren } from "react";
import { memo, useCallback } from "react";
import { cn } from "../utils/cssClassNames";
import s from "./ActionButton.module.css";
import type { IconName, IconSize } from "./Icon";
import { Icon } from "./Icon";

export interface ActionButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  id?: string;
  iconName?: IconName;
  onlyIcon?: boolean;
  title?: string;
  text?: string;
  name?: string;
  hidden?: boolean;
  type?: "submit" | "reset" | "button";
  doubleSized?: boolean;
  disabled?: boolean;
  noBackground?: boolean;
  noBorder?: boolean;
  iconSize?: IconSize;
  isActive?: boolean;
  isPrimary?: boolean;
  isFluidOnMobile?: boolean;
  isModalButton?: boolean;
  isSidebarButton?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

export const ActionButton = memo(function ActionButton({
  id,
  iconName,
  onlyIcon = false,
  title,
  text,
  name,
  hidden = false,
  type = "button",
  doubleSized = false,
  disabled,
  noBackground,
  noBorder,
  iconSize,
  isActive = false,
  isPrimary = false,
  isFluidOnMobile = false,
  isModalButton = false,
  isSidebarButton = false,
  style,
  onClick,
  children,
  ...rest
}: PropsWithChildren<ActionButtonProps>) {
  const handleClick = useCallback(() => {
    if (typeof onClick === "function") {
      onClick();
    }
  }, [onClick]);

  const additionalHtmlAttributes = {
    id,
    className: cn([
      s.ActionButton,
      doubleSized && s.DoubleSized,
      noBackground && s.NoBackground,
      noBorder && s.NoBorder,
      isActive && s.ActiveButton,
      isPrimary && s.PrimaryButton,
      isFluidOnMobile && s.FluidOnMobile,
      isModalButton && s.ModalActionButton,
      isSidebarButton && s.SidebarActionButton,
    ]),
    hidden,
    disabled,
    type: type || "button",
    style,
  };

  return (
    <button
      onClick={handleClick}
      title={title || text}
      aria-label={title || text}
      name={name}
      {...additionalHtmlAttributes}
      {...rest}
    >
      {iconName && <Icon iconName={iconName} size={iconSize} />}
      {!onlyIcon && text && <span className={s.ActionButtonText}>{text}</span>}
      {children}
    </button>
  );
});
