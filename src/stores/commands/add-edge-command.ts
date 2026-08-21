import { Command } from "@/types/command";
import { GraphEdge } from "@/types/graph-data-store";
import { useGraphDataStore } from "../graph-data-store";
import { graphService } from "@/services/graph-service";

class AddEdgeCommand implements Command {
  constructor(private edge: GraphEdge) {}

  execute() {
    useGraphDataStore.getState().addEdge(this.edge);
    graphService.addEdgeToCy(this.edge);
  }

  undo() {
    useGraphDataStore.getState().removeEdge(this.edge.id);
    graphService.removeElementById(this.edge.id);
  }
}

export default AddEdgeCommand;