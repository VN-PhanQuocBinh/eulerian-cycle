import { Command } from "@/types/command";
import { graphService } from "@/services/graph-service";
import { GraphNode } from "@/types/graph-data-store";
import { useGraphDataStore } from "../graph-data-store";

class AddNodeCommand implements Command {
  constructor(private graphNode: GraphNode) {}

  /**
   * @throws {Error} Error if the node label is empty or if there is an issue adding the node to the graph data store or the graph service.
   */
  execute() {
    const graphDataStore = useGraphDataStore.getState();

    graphDataStore.addNode(this.graphNode);
    graphService.addNodeToCy(this.graphNode);
  }

  /**
   * @throws {Error} Error if there is an issue removing the node from the graph data store or the graph service.
   */
  undo() {
    const graphDataStore = useGraphDataStore.getState();
    graphDataStore.removeNode(this.graphNode.id);
    graphService.removeElementById(this.graphNode.id);
  }
}

export default AddNodeCommand;
