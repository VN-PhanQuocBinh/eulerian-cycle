import { Command, GraphEdgeSnapshot } from "@/types/command";
import { CommandContext } from "@/services/command-context";

class RemoveEdgeCommand implements Command {
  private edge: GraphEdgeSnapshot;

  constructor(
    private edgeId: string,
    private context: CommandContext,
  ) {
    const edgeData = this.context.graphDataStore.getEdgeDataById(this.edgeId);

    if (!edgeData) {
      throw new Error(
        `Cannot create RemoveEdgeCommand: edge with ID ${this.edgeId} does not exist.`,
      );
    }

    const classes = this.context.graphService.getClassesByElementId(this.edgeId);
    this.edge = {
      data: edgeData,
      classes: classes,
    };
  }

  execute() {
    this.context.graphDataStore.removeEdge(this.edgeId);
    this.context.graphService.removeElementById(this.edgeId);
  }

  undo() {
    if (!this.edge) throw new Error("Cannot undo RemoveEdgeCommand: edge snapshot is missing.");

    this.context.graphDataStore.addEdge(this.edge.data);
    this.context.graphService.addEdgesToCy([this.edge]);
  }
}

export default RemoveEdgeCommand;
