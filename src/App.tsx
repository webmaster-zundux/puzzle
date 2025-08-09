import "@fontsource-variable/open-sans";
import type { FC } from "react";
import { memo } from "react";
import "./styles.css";

import { PuzzleDataProvider } from "./components/PuzzleDataProvider";
import { PuzzlePage } from "./pages/PuzzlePage";

export const App: FC = memo(function App() {
  return (
    <PuzzleDataProvider>
      <PuzzlePage />
    </PuzzleDataProvider>
  );
});
