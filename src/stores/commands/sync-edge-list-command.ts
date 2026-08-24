import { Command } from "@/types/command";
import { GraphNode, GraphEdge, GraphData } from "@/types/graph-data-store";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { CommandContext } from "@/services/command-context";

class SyncEdgeListCommand implements Command {
  private previousGraphData: GraphData;
  private currentSnapshot: GraphData | null = null;

  constructor(
    private graphData: { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean },
    private algorithm: GraphAlgorithm,
    private context: CommandContext
  ) {
    this.previousGraphData = this.context.graphService.getGraphSnapshot();
  }

  execute() {
    if (!this.currentSnapshot) {
      this.context.graphService.drawGraphFromData(this.graphData);
      this.context.graphService.autoLayout(this.algorithm, false);

      this.currentSnapshot = this.context.graphService.getGraphSnapshot();
    } else {
      this.context.graphService.drawGraphFromData(this.currentSnapshot);
    }

    this.context.graphDataStore.updateGraphData(this.currentSnapshot);
  }

  undo() {
    this.context.graphDataStore.updateGraphData(this.previousGraphData);
    this.context.graphService.drawGraphFromData(this.previousGraphData);
  }
}

export default SyncEdgeListCommand;