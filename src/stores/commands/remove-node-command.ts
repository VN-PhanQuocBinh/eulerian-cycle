import { CommandContext } from '@/services/command-context';
import { Command, GraphEdgeSnapshot, GraphNodeSnapshot } from "@/types/command";

class RemoveNodeCommand implements Command {
  private nodeSnapshot: GraphNodeSnapshot | null = null;
  private connectedEdgesSnapshots: GraphEdgeSnapshot[] = [];

  constructor(private nodeId: string, private context: CommandContext) {
    // Get snapshot of the node to be removed
    const nodeSnapshot = this.context.graphService.getNodeSnapshotById(this.nodeId);
    if (!nodeSnapshot) {
      throw new Error(
        `Cannot create RemoveNodeCommand: node with ID ${this.nodeId} does not exist.`,
      );
    }
    this.nodeSnapshot = nodeSnapshot;

    // Get snapshots of connected edges
    const connectedEdges: GraphEdgeSnapshot[] = [];
    const nodeEdges = this.context.graphDataStore.getEdgesByNodeId(this.nodeId);
    nodeEdges.forEach((edge) => {
      const edgeSnapshot = this.context.graphService.getEdgeSnapshotById(edge.id);

      if (!edgeSnapshot) {
        throw new Error(
          `Cannot create RemoveNodeCommand: connected edge with ID ${edge.id} does not exist.`,
        );
      }

      connectedEdges.push(edgeSnapshot);
    });
    
    this.connectedEdgesSnapshots = connectedEdges;
  }

  execute() {
    if (!this.nodeSnapshot)
      throw new Error("Cannot execute RemoveNodeCommand: node snapshot is missing.");

    // Remove connected edges first
    this.connectedEdgesSnapshots.forEach((edgeSnapshot) => {
      this.context.graphDataStore.removeEdge(edgeSnapshot.data.id);
      this.context.graphService.removeElementById(edgeSnapshot.data.id);
    });

    // Remove the node
    this.context.graphDataStore.removeNode(this.nodeId);
    this.context.graphService.removeElementById(this.nodeId);
  }

  undo() {
    if (!this.nodeSnapshot)
      throw new Error("Cannot undo RemoveNodeCommand: node snapshot is missing.");

    // Restore the node
    const { data: nodeData } = this.nodeSnapshot;
    this.context.graphDataStore.addNode(nodeData);
    this.context.graphService.addNodeToCy(this.nodeSnapshot);

    // Restore connected edges
    this.connectedEdgesSnapshots.forEach((edgeSnapshot) => {
      this.context.graphDataStore.addEdge(edgeSnapshot.data);
    });
    this.context.graphService.addEdgesToCy(this.connectedEdgesSnapshots);
  }
}

export default RemoveNodeCommand;
