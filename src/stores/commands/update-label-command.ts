import { GraphEdge, GraphNode } from "@/types/graph-data-store";
import { Command } from "@/types/command";
import { CommandContext } from "@/services/command-context";

class UpdateLabelCommand implements Command {
  private oldLabel: string;

  constructor(
    private elementId: string,
    private newLabel: string,
    private context: CommandContext,
  ) {
    const element =
      this.context.graphDataStore.getNodeDataById(elementId) ||
      this.context.graphDataStore.getEdgeDataById(elementId);

    if (!element) {
      throw new Error(
        `Cannot create UpdateLabelCommand: element with ID ${elementId} does not exist.`,
      );
    }

    this.oldLabel = element.label || "";
  }

  execute() {
    const element =
      this.context.graphDataStore.getNodeDataById(this.elementId) ||
      this.context.graphDataStore.getEdgeDataById(this.elementId);

    if (!element) {
      throw new Error(
        `Cannot execute UpdateLabelCommand: element with ID ${this.elementId} does not exist.`,
      );
    }

    // Update the label in the store
    if (this.isNode(element)) {
      this.context.graphDataStore.updateNode(this.elementId, { label: this.newLabel });
    } else if (this.isEdge(element)) {
      this.context.graphDataStore.updateEdge(this.elementId, { label: this.newLabel });
    }

    // Update the label in the graph canvas
    this.context.graphService.updateEdgeInCy({
      id: this.elementId,
      label: this.newLabel,
    });
  }

  undo() {
    const element =
      this.context.graphDataStore.getNodeDataById(this.elementId) ||
      this.context.graphDataStore.getEdgeDataById(this.elementId);

    if (!element) {
      throw new Error(
        `Cannot undo UpdateLabelCommand: element with ID ${this.elementId} does not exist.`,
      );
    }

    // Revert the label in the store
    if (this.isNode(element)) {
      this.context.graphDataStore.updateNode(this.elementId, { label: this.oldLabel });
    } else if (this.isEdge(element)) {
      this.context.graphDataStore.updateEdge(this.elementId, { label: this.oldLabel });
    }

    // Revert the label in the graph canvas
    this.context.graphService.updateEdgeInCy({
      id: this.elementId,
      label: this.oldLabel,
    });
  }

  private isNode(element: any): element is GraphNode {
    return (element as GraphNode).x !== undefined && (element as GraphNode).y !== undefined;
  }

  private isEdge(element: any): element is GraphEdge {
    return (
      (element as GraphEdge).source !== undefined && (element as GraphEdge).target !== undefined
    );
  }
}

export default UpdateLabelCommand;
