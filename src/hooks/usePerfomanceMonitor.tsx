import { useEffect, useState } from "react";
import type { PanelName } from "../utils/stats";
import { PanelNames, Stats } from "../utils/stats";
import { useDebugSettingsState } from "./useDebugSettings";

export const usePerfomanceMonitor = (initialVisiblePanel: PanelName = PanelNames.MS) => {
  const { showCanvasPerfomanceMonitor } = useDebugSettingsState();
  const [perfomanceMonitor, setPerfomanceMonitor] = useState<Stats>();

  useEffect(() => {
    if (!showCanvasPerfomanceMonitor) {
      return;
    }

    const stats = new Stats();
    stats.showPanel(initialVisiblePanel);

    document.body.appendChild(stats.dom);
    setPerfomanceMonitor(stats);

    return () => {
      setPerfomanceMonitor(undefined);
      stats.dom.remove();
      stats.destroy();
    };
  }, [initialVisiblePanel, showCanvasPerfomanceMonitor]);

  return perfomanceMonitor;
};
