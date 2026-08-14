import { Command } from "@/types/command";
import { graphService } from "@/services/graph-service";
import { GraphNode, GraphEdge, GraphData } from "@/types/graph-data-store";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { useGraphDataStore } from "../graph-data-store";

export class SyncEdgeListCommand implements Command {
  private previousGraphData = graphService.getGraphSnapshot();
  private currentSnapshot: GraphData | null = null;

  constructor(
    private graphData: { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean },
    private algorithm: GraphAlgorithm,
  ) {}

  async execute() {
    if (!this.currentSnapshot) {
      graphService.drawGraphFromData(this.graphData);
      graphService.autoLayout(this.algorithm, false);

      this.currentSnapshot = graphService.getGraphSnapshot();
      useGraphDataStore.getState().updateGraphData(this.currentSnapshot);
    } else {
      graphService.drawGraphFromData(this.currentSnapshot);
    }
  }

  undo() {
    graphService.drawGraphFromData(this.previousGraphData);
  }
}
