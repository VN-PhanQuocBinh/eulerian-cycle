import { Command, StyledGraphEdge } from "@/types/command";
import { useGraphDataStore } from "../graph-data-store";
import { graphService } from "@/services/graph-service";

class RemoveEdgeCommand implements Command {
  constructor(private edge: StyledGraphEdge) {}

  execute() {
    useGraphDataStore.getState().removeEdge(this.edge.id);
    graphService.removeElementById(this.edge.id);
  }

  undo() {
    useGraphDataStore.getState().addEdge(this.edge);
    graphService.addEdgeToCy(this.edge);
  }
}

export default RemoveEdgeCommand;
