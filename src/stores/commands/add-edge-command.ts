import { Command } from "@/types/command";
import { GraphEdge } from "@/types/graph-data-store";
import { CommandContext } from "@/services/command-context";

class AddEdgeCommand implements Command {
  constructor(
    private edge: GraphEdge,
    private context: CommandContext,
  ) {}

  execute() {
    this.context.graphDataStore.addEdge(this.edge);
    this.context.graphService.addEdgeToCy({
      data: this.edge,
    });
  }

  undo() {
    this.context.graphDataStore.removeEdge(this.edge.id);
    this.context.graphService.removeElementById(this.edge.id);
  }
}

export default AddEdgeCommand;
