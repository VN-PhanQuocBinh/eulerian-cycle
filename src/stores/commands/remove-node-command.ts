import { useGraphDataStore } from '@/stores';
import { Command, GraphEdgeSnapshot, GraphNodeSnapshot } from "@/types/command";
import { graphService } from "@/services/graph-service";

class RemoveNodeCommand implements Command {
  private nodeSnapshot: GraphNodeSnapshot | null = null;
  private connectedEdgesSnapshots: GraphEdgeSnapshot[] = [];

  constructor(private nodeId: string) {
    const nodeData = useGraphDataStore.getState().getNodeDataById(this.nodeId);
    const nodeSnapshot: GraphNodeSnapshot = {
      data: nodeData!,
      style: {},
      classes: graphService.getClassesByElementId(this.nodeId),
    };
    this.nodeSnapshot = nodeSnapshot;

    // Get snapshots of connected edges
    const connectedEdges = useGraphDataStore.getState().getEdgesByNodeId(this.nodeId);
    this.connectedEdgesSnapshots = connectedEdges.map((edge) => {
      const edgeSnapshot: GraphEdgeSnapshot = {
        data: edge,
        style: {},
        classes: graphService.getClassesByElementId(edge.id),
      };
      return edgeSnapshot;
    });
  }

  execute() {
    if (!this.nodeSnapshot) throw new Error("Cannot execute RemoveNodeCommand: node snapshot is missing.");

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
    if (!this.nodeSnapshot) throw new Error("Cannot undo RemoveNodeCommand: node snapshot is missing.");

    // Restore the node
    const { data: nodeData } = this.nodeSnapshot;
    useGraphDataStore.getState().addNode(nodeData);
    graphService.addNodeToCy(nodeData);

    // Restore connected edges
    this.connectedEdgesSnapshots.forEach((edgeSnapshot) => {
      const { data: edgeData } = edgeSnapshot;
      useGraphDataStore.getState().addEdge(edgeData);
      graphService.addEdgeToCy(edgeData);
    });
  }
}

export default RemoveNodeCommand;
