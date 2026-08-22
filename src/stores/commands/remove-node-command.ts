import { useGraphDataStore } from "@/stores";
import { Command, GraphEdgeSnapshot, GraphNodeSnapshot } from "@/types/command";
import { graphService } from "@/services/graph-service";

class RemoveNodeCommand implements Command {
  private nodeSnapshot: GraphNodeSnapshot | null = null;
  private connectedEdgesSnapshots: GraphEdgeSnapshot[] = [];

  constructor(private nodeId: string) {
    // Get snapshot of the node to be removed
    const nodeSnapshot = graphService.getNodeSnapshotById(this.nodeId);
    if (!nodeSnapshot) {
      throw new Error(
        `Cannot create RemoveNodeCommand: node with ID ${this.nodeId} does not exist.`,
      );
    }
    this.nodeSnapshot = nodeSnapshot;

    // Get snapshots of connected edges
    const connectedEdges: GraphEdgeSnapshot[] = [];
    const nodeEdges = useGraphDataStore.getState().getEdgesByNodeId(this.nodeId);
    nodeEdges.forEach((edge) => {
      const edgeSnapshot = graphService.getEdgeSnapshotById(edge.id);

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
      useGraphDataStore.getState().removeEdge(edgeSnapshot.data.id);
      graphService.removeElementById(edgeSnapshot.data.id);
    });

    // Remove the node
    useGraphDataStore.getState().removeNode(this.nodeId);
    graphService.removeElementById(this.nodeId);
  }

  undo() {
    if (!this.nodeSnapshot)
      throw new Error("Cannot undo RemoveNodeCommand: node snapshot is missing.");

    // Restore the node
    const { data: nodeData } = this.nodeSnapshot;
    useGraphDataStore.getState().addNode(nodeData);
    graphService.addNodeToCy(this.nodeSnapshot);

    // Restore connected edges
    this.connectedEdgesSnapshots.forEach((edgeSnapshot) => {
      useGraphDataStore.getState().addEdge(edgeSnapshot.data);
    });
    graphService.addEdgesToCy(this.connectedEdgesSnapshots);
  }
}

export default RemoveNodeCommand;
