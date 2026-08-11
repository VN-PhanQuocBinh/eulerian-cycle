import { Command } from "@/types/command";
import { graphService as graphServiceInstance } from "@/services/graph-service";
import { GraphNode } from "@/types/graph-data-store";
import { useGraphDataStore } from "../graph-data-store";

class AddCommand implements Command {
  constructor(
    private graphService: typeof graphServiceInstance,
    private graphNode: GraphNode
  ) {}

  /**
   * @throws {Error} Error if the node label is empty or if there is an issue adding the node to the graph data store or the graph service.
   */
  execute() {
    
    try {
      const graphDataStore = useGraphDataStore();

      graphDataStore.addNode(this.graphNode);
      this.graphService.addNodeToCy(this.graphNode);
    } catch (error) {
      console.error("Error executing AddCommand:", error);
    }
  }

  /**
   * @throws {Error} Error if there is an issue removing the node from the graph data store or the graph service.
   */
  undo() {
    const graphDataStore = useGraphDataStore();
    graphDataStore.removeNode(this.graphNode.id);
    this.graphService.removeElementById(this.graphNode.id);
  }
}

export default AddCommand;