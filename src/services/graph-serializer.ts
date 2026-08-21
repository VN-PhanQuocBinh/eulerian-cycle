import type { GraphCanvasAdapter } from "@/services/graph-canvas-adapter";

export class GraphSerializer {
  constructor(private readonly canvas: GraphCanvasAdapter) {}

  getGraphSnapshot() {
    return this.canvas.getGraphSnapshot();
  }

  getPNG() {
    return this.canvas.getPNG();
  }
}
