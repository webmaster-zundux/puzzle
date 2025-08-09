import { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import s from "./DebugTextureCacheCanvas.module.css";

export const DEBUG_TEXTURE_CACHE_HTMLCANVASELEMENT_ID = "texture-cache";

export const DebugTextureCacheCanvas = memo(function DebugTextureCacheCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTextureCacheId, setTextureCacheIdActive] = useState("piece_100:100");

  const handleSwitchActiveTextureAndRenderIt = useCallback(
    ({ goToNext = true }: { goToNext: boolean }) => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) {
        return;
      }

      const idsListString = canvasEl.dataset.textureCacheIds;
      if (!idsListString) {
        return;
      }

      const ids = idsListString
        .split(";")
        .filter((v) => v)
        .reverse();

      const index = ids.findIndex((id) => id === activeTextureCacheId);
      const maxIndex = ids.length - 1;

      let selectedIndex = 0;
      if (index === -1) {
        selectedIndex = 0;
      } else {
        if (goToNext) {
          selectedIndex = index + 1;
        } else {
          selectedIndex = index - 1;
        }

        if (selectedIndex < 0) {
          selectedIndex = maxIndex;
        }

        if (selectedIndex > maxIndex) {
          selectedIndex = 0;
        }
      }

      setTextureCacheIdActive(ids[selectedIndex]);
    },
    [activeTextureCacheId],
  );

  useLayoutEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      return;
    }

    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    canvasEl.click();
  }, [activeTextureCacheId]);

  const handleSwitchToPreviousTextureActiveAndRenderIt = useCallback(
    () => handleSwitchActiveTextureAndRenderIt({ goToNext: false }),
    [handleSwitchActiveTextureAndRenderIt],
  );

  const handleSwitchToNextTextureActiveAndRenderIt = useCallback(
    () => handleSwitchActiveTextureAndRenderIt({ goToNext: true }),
    [handleSwitchActiveTextureAndRenderIt],
  );

  return (
    <div className={s.CanvasContainer}>
      <canvas
        ref={canvasRef}
        id={DEBUG_TEXTURE_CACHE_HTMLCANVASELEMENT_ID}
        className={s.Canvas}
        width={264 * 10}
        height={350 * 10}
        data-texture-cache-ids=""
        data-texture-cache-id-active={activeTextureCacheId}
        onDoubleClick={handleSwitchToNextTextureActiveAndRenderIt}
      ></canvas>

      <div className={s.InfoPanelContainer}>
        <div className={s.InfoPanel}>
          <div id="texture-cache-active-id" className={s.ActiveTextureName}>
            {activeTextureCacheId}
          </div>

          <div className={s.SwitchingButtons}>
            <button
              title="previous"
              className={s.SwitchingButton}
              onClick={handleSwitchToPreviousTextureActiveAndRenderIt}
            >
              &lt;
            </button>
            <button title="next" className={s.SwitchingButton} onClick={handleSwitchToNextTextureActiveAndRenderIt}>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
