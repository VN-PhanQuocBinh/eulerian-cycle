import { Command, GraphEdgeSnapshot } from "@/types/command";
import { useGraphDataStore } from "../graph-data-store";
import { graphService } from "@/services/graph-service";

class RemoveEdgeCommand implements Command {
  private edge: GraphEdgeSnapshot | null = null;

  constructor(private edgeId: string) {
    const edgeData = useGraphDataStore.getState().getEdgeDataById(this.edgeId);

    if (!edgeData) {
      throw new Error(
        `Cannot create RemoveEdgeCommand: edge with ID ${this.edgeId} does not exist.`,
      );
    }

    if (edgeData) {
      const classes = graphService.getClassesByElementId(this.edgeId);
      this.edge = {
        data: edgeData,
        classes: classes,
      };
    }
  }

  execute() {
    useGraphDataStore.getState().removeEdge(this.edgeId);
    graphService.removeElementById(this.edgeId);
  }

  undo() {
    if (!this.edge) throw new Error("Cannot undo RemoveEdgeCommand: edge snapshot is missing.");

    useGraphDataStore.getState().addEdge(this.edge.data);
    graphService.addEdgesToCy([this.edge]);
  }
}

export default RemoveEdgeCommand;
