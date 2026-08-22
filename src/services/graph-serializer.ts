import type { GraphCanvasAdapter } from "@/services/graph-canvas-adapter";

export class GraphSerializer {
  constructor(private readonly canvas: GraphCanvasAdapter) {}

  getNodeSnapshotById(nodeId: string) {
    return this.canvas.getNodeSnapshotById(nodeId);
  }

  getEdgeSnapshotById(edgeId: string) {
    return this.canvas.getEdgeSnapshotById(edgeId);
  }

  getGraphSnapshot() {
    return this.canvas.getGraphSnapshot();
  }

  getPNG() {
    return this.canvas.getPNG();
  }
}
