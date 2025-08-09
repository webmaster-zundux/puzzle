import type { CSSProperties, PropsWithChildren } from "react";
import { memo } from "react";
import { ActionButton } from "../../../components/ActionButton";

interface ChoiceButtonProps {
  isPrimary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export const ChoiceButton = memo(function ChoiceButton({
  isPrimary = false,
  disabled = false,
  onClick,
  children,
}: PropsWithChildren<ChoiceButtonProps>) {
  const buttonStyle: CSSProperties = {
    padding: "0.6em 2em",
    minWidth: "11.5em",
    minHeight: "11.5em",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <ActionButton isPrimary={isPrimary} disabled={disabled} onClick={onClick} isFluidOnMobile style={buttonStyle}>
      {children}
    </ActionButton>
  );
});
