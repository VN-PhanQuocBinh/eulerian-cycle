import { CommandContext } from "@/services/command-context";
import { Command } from "@/types/command";
import { GraphNode } from "@/types/graph-data-store";

class AddNodeCommand implements Command {
  constructor(
    private graphNode: GraphNode,
    private context: CommandContext,
  ) {}

  /**
   * @throws {Error} Error if the node label is empty or if there is an issue adding the node to the graph data store or the graph service.
   */
  execute() {
    this.context.graphDataStore.addNode(this.graphNode);
    this.context.graphService.addNodeToCy({ data: this.graphNode });
  }

  /**
   * @throws {Error} Error if there is an issue removing the node from the graph data store or the graph service.
   */
  undo() {
    this.context.graphDataStore.removeNode(this.graphNode.id);
    this.context.graphService.removeElementById(this.graphNode.id);
  }
}

export default AddNodeCommand;
