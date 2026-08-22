import { Command, GraphEdgeSnapshot } from "@/types/command";
import { useGraphDataStore } from "../graph-data-store";
import { graphService } from "@/services/graph-service";
import { GraphEdge } from "@/types/graph-data-store";

class RemoveEdgeCommand implements Command {
  private edge: GraphEdgeSnapshot | null = null;

  constructor(private edgeId: string) {
    const edgeData = useGraphDataStore.getState().getEdgeDataById(this.edgeId);
    
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

    const { data: edgeSnapshot } = this.edge;
    const edgeForUndo: GraphEdge = {
      source: edgeSnapshot.source,
      target: edgeSnapshot.target,
      id: edgeSnapshot.id,
      label: edgeSnapshot.label,
    };

    useGraphDataStore.getState().addEdge(edgeForUndo);
    graphService.addEdgeToCy(edgeForUndo);
  }
}

export default RemoveEdgeCommand;
