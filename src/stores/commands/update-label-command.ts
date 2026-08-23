import { GraphEdge, GraphNode } from "@/types/graph-data-store";
import { Command } from "@/types/command";
import { graphService } from "@/services/graph-service";
import { useGraphDataStore } from "../graph-data-store";

class UpdateLabelCommand implements Command {
  private oldLabel: string;

  constructor(
    private elementId: string,
    private newLabel: string,
  ) {
    const element =
      useGraphDataStore.getState().getNodeDataById(elementId) ||
      useGraphDataStore.getState().getEdgeDataById(elementId);

    if (!element) {
      throw new Error(
        `Cannot create UpdateLabelCommand: element with ID ${elementId} does not exist.`,
      );
    }

    this.oldLabel = element.label || "";
  }

  execute() {
    const element =
      useGraphDataStore.getState().getNodeDataById(this.elementId) ||
      useGraphDataStore.getState().getEdgeDataById(this.elementId);

    if (!element) {
      throw new Error(
        `Cannot execute UpdateLabelCommand: element with ID ${this.elementId} does not exist.`,
      );
    }

    // Update the label in the store
    if (this.isNode(element)) {
      useGraphDataStore.getState().updateNode(this.elementId, { label: this.newLabel });
    } else if (this.isEdge(element)) {
      useGraphDataStore.getState().updateEdge(this.elementId, { label: this.newLabel });
    }

    // Update the label in the graph canvas
    graphService.updateEdgeInCy({
      id: this.elementId,
      label: this.newLabel,
    });
  }

  undo() {
    const element =
      useGraphDataStore.getState().getNodeDataById(this.elementId) ||
      useGraphDataStore.getState().getEdgeDataById(this.elementId);

    if (!element) {
      throw new Error(
        `Cannot undo UpdateLabelCommand: element with ID ${this.elementId} does not exist.`,
      );
    }

    // Revert the label in the store
    if (this.isNode(element)) {
      useGraphDataStore.getState().updateNode(this.elementId, { label: this.oldLabel });
    } else if (this.isEdge(element)) {
      useGraphDataStore.getState().updateEdge(this.elementId, { label: this.oldLabel });
    }

    // Revert the label in the graph canvas
    graphService.updateEdgeInCy({
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
