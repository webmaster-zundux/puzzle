import type { PropsWithChildren } from "react";
import { memo } from "react";
import type { ActionButtonProps } from "./ActionButton";
import { ActionButton } from "./ActionButton";

export interface ModalActionButtonProps extends ActionButtonProps {}

export const ModalActionButton = memo(function ModalActionButton({
  children,
  ...restProps
}: PropsWithChildren<ModalActionButtonProps>) {
  return (
    <ActionButton {...restProps} isModalButton>
      {children}
    </ActionButton>
  );
});
