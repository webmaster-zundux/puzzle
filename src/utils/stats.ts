/**
 * @author mrdoob / http://mrdoob.com/
 * @source https://github.com/mrdoob/stats.js
 * rewriten on typescript
 */
const SIZE_OF_ONE_MEGABYTE = 1048576; // =1024*1024
const MILLISECONDS_IN_ONE_SECOND = 1000;

// @ts-expect-error lack of support performance.memory (deprecated) // todo replace by  Performance.measureUserAgentSpecificMemory()
const IS_MEMORY_ALLOCATION_INFO_AVAILABLE = window?.performance && window?.performance.memory;

export class Stats {
  REVISION = 16;

  mode = 0;
  container: HTMLDivElement;
  containerElementId = "#canvas-perfomance-monitor";

  dom: HTMLDivElement;

  prevTime = 0;
  beginTime = 0;
  frames = 0;

  panels: Array<MsPanel | FpsPanel | MbPanel> = [];

  constructor() {
    const existingPerformanceMonitorElements = document.querySelectorAll(this.containerElementId);
    if (existingPerformanceMonitorElements.length) {
      existingPerformanceMonitorElements.forEach((el) => el.remove());
    }

    this.container = document.createElement("div");
    this.container.id = this.containerElementId;

    this.container.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:90000";

    this.addHandlers();

    this.dom = this.container;

    this.beginTime = (performance || Date).now();
    this.prevTime = this.beginTime;
    this.frames = 0;

    this.addPanel(new FpsPanel("FPS", "#0ff", "#022"));
    this.addPanel(new MsPanel("MS", "#0f0", "#020"));

    if (IS_MEMORY_ALLOCATION_INFO_AVAILABLE) {
      this.addPanel(new MbPanel("MB", "#f08", "#201"));
    }

    this.showPanel(0);
  }

  addHandlers() {
    this.container.addEventListener("click", (event) => this.handleClick(event), false);
  }

  removehandlers() {
    this.container.removeEventListener("click", (event) => this.handleClick(event), false);
  }

  destroy() {
    this.removehandlers();
  }

  handleClick(event: MouseEvent) {
    event.preventDefault();
    this.showPanel(++this.mode % this.container.children.length);
  }

  addPanel(panel: MsPanel | FpsPanel | MbPanel) {
    this.panels.push(panel);
    this.container.appendChild(panel.dom);

    return panel;
  }

  showPanel(id: number | PanelName): void {
    if (typeof id === "number") {
      this.mode = id;
    } else if (typeof id === "string") {
      const index = this.panels.findIndex((panel) => panel.name === id);

      if (index === -1) {
        return;
      }

      this.mode = index;
    }

    for (let i = 0; i < this.container.children.length; i++) {
      (this.container.children[i] as HTMLElement).style.display = i === this.mode ? "block" : "none";
    }
  }

  begin() {
    this.beginTime = (performance || Date).now();
  }

  end() {
    this.frames++;
    const time = (performance || Date).now();

    this.panels.forEach((panel) => {
      this.updatePanel(panel, time);
    });

    if (time >= this.prevTime + MILLISECONDS_IN_ONE_SECOND) {
      this.prevTime = time;
      this.frames = 0;
    }

    return time;
  }

  updatePanel(panel: MsPanel | FpsPanel | MbPanel, time: number) {
    switch (panel.name) {
      case PanelNames.MS: {
        panel.updateValue(time, this.beginTime);
        return;
      }
      case PanelNames.FPS: {
        panel.updateValue(time, this.prevTime, this.frames);
        return;
      }
      case PanelNames.MB: {
        panel.updateValue(time, this.prevTime);
        return;
      }
    }
  }

  update() {
    this.beginTime = this.end();
  }
}

abstract class AbstractPanel {
  abstract updateValue(time: number, prevTime: number, frames: number): void;
}

abstract class Panel extends AbstractPanel {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  dom: HTMLCanvasElement; // Backwards Compatibility

  PR: number;
  WIDTH: number;
  HEIGHT: number;
  TEXT_X: number;
  TEXT_Y: number;
  GRAPH_X: number;
  GRAPH_Y: number;
  GRAPH_WIDTH: number;
  GRAPH_HEIGHT: number;

  round = Math.round;

  constructor(
    public name: PanelName | string,
    public fg: PanelForegroundColor,
    public bg: PanelBackgroundColor,
  ) {
    super();

    this.PR = this.round(window?.devicePixelRatio || 1);

    this.WIDTH = 80 * this.PR;
    this.HEIGHT = 48 * this.PR;
    this.TEXT_X = 3 * this.PR;
    this.TEXT_Y = 2 * this.PR;
    this.GRAPH_X = 3 * this.PR;
    this.GRAPH_Y = 15 * this.PR;
    this.GRAPH_WIDTH = 74 * this.PR;
    this.GRAPH_HEIGHT = 30 * this.PR;

    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    this.dom = canvas;

    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;
    canvas.style.cssText = "width:80px;height:48px";

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Error. Impossible get 2d context of just created new canvas");
    }
    this.context = context;

    this.drawPanelBase();
  }

  drawPanelGraph(value: number, maxValue: number) {
    const context = this.context;
    if (!context) {
      throw new Error("Error. Impossible get 2d context of just created new canvas");
    }

    let min = Infinity;
    let max = 0;
    const round = this.round;

    min = Math.min(min, value);
    max = Math.max(max, value);

    context.fillStyle = this.bg;
    context.globalAlpha = 1;
    context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
    context.fillStyle = this.fg;
    context.fillText(`${round(value)} ${this.name} (${round(min)}-${round(max)})`, this.TEXT_X, this.TEXT_Y);

    context.drawImage(
      this.canvas,
      this.GRAPH_X + this.PR,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT,
      this.GRAPH_X,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT,
    );

    context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);

    context.fillStyle = this.bg;
    context.globalAlpha = 0.9;
    context.fillRect(
      this.GRAPH_X + this.GRAPH_WIDTH - this.PR,
      this.GRAPH_Y,
      this.PR,
      round((1 - value / maxValue) * this.GRAPH_HEIGHT),
    );
  }

  private drawPanelBase() {
    const context = this.context;
    if (!context) {
      throw new Error("Error. Impossible get 2d context of just created new canvas");
    }
    context.font = "bold " + 9 * this.PR + "px Helvetica,Arial,sans-serif";
    context.textBaseline = "top";

    context.fillStyle = this.bg;
    context.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    context.fillStyle = this.fg;
    context.fillText(String(this.name), this.TEXT_X, this.TEXT_Y);
    context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

    context.fillStyle = this.bg;
    context.globalAlpha = 0.9;
    context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
  }
}

export const PanelNames = {
  FPS: "FPS" as const,
  MS: "MS" as const,
  MB: "MB" as const,
};
export type PanelName = keyof typeof PanelNames;
export type PanelForegroundColor = string;
export type PanelBackgroundColor = string;

/**
 * Milliseconds per frame
 */
export class MsPanel extends Panel {
  name = PanelNames.MS;
  durationLimitMs = 200;

  updateValue(time: number, beginTime: number) {
    const timeDelta = time - beginTime;
    this.drawPanelGraph(timeDelta, this.durationLimitMs);
  }
}

/**
 * Frames per second
 */
export class FpsPanel extends Panel {
  name = PanelNames.FPS;
  fpsLimit = 200;

  updateOncePerSecond = true;

  updateValue(time: number, prevTime: number, frames: number) {
    if (this.updateOncePerSecond) {
      if (time < prevTime + MILLISECONDS_IN_ONE_SECOND) {
        return;
      }
    }

    const timeDelta = time - prevTime;
    const fps = (frames * MILLISECONDS_IN_ONE_SECOND) / timeDelta;
    this.drawPanelGraph(fps, this.fpsLimit);
  }
}

/**
 * Used memory
 */
export class MbPanel extends Panel {
  name = PanelNames.MB;
  memoryLimitMB = 128; // megabytes

  updateValue(time: number, prevTime: number) {
    if (time >= prevTime + MILLISECONDS_IN_ONE_SECOND) {
      if (IS_MEMORY_ALLOCATION_INFO_AVAILABLE) {
        // @ts-expect-error lack of support (deprecated)
        const memory = window?.performance.memory;

        this.drawPanelGraph(
          memory.usedJSHeapSize / SIZE_OF_ONE_MEGABYTE,
          this.memoryLimitMB || memory.jsHeapSizeLimit / SIZE_OF_ONE_MEGABYTE,
        );
      }
    }
  }
}
