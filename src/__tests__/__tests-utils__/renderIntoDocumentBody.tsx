import type { RenderOptions, RenderResult } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";

export const renderIntoDocumentBody = (ui: ReactNode, options?: Omit<RenderOptions, "queries">): RenderResult => {
  return render(ui, {
    ...options,
    container: document.body,
  });
};
