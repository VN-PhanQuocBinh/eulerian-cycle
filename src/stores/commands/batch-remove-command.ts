import { Command, GraphEdgeSnapshot, GraphNodeSnapshot } from "@/types/command";
import { useGraphDataStore } from "@/stores";
import { graphService } from "@/services/graph-service";

class BatchRemoveCommand implements Command {
  private elementsSnapshot: { nodes: GraphNodeSnapshot[]; edges: GraphEdgeSnapshot[] } = {
    nodes: [],
    edges: [],
  };

  constructor() {
    const selectedElements = graphService.getSelectedElements();

    const connectedEdges: GraphEdgeSnapshot[] = [];
    const edgeIdsSet = new Set<string>(); // To avoid duplicates when collecting connected edges

    selectedElements.nodes.forEach((node) => {
      const selectedEdges = useGraphDataStore.getState().getEdgesByNodeId(node.data.id);
      const selectedEdgesSnapshots: GraphEdgeSnapshot[] = [];

      // Collect snapshots of connected edges for each selected node
      selectedEdges.forEach((edge) => {
        const edgeSnapshot = graphService.getEdgeSnapshotById(edge.id);
        if (!edgeSnapshot) {
          throw new Error(
            `Cannot create BatchRemoveCommand: connected edge with ID ${edge.id} does not exist.`,
          );
        }

        if (!edgeIdsSet.has(edge.id)) {
          edgeIdsSet.add(edge.id);
          selectedEdgesSnapshots.push(edgeSnapshot);
        }
      });

      // Add the connected edges snapshots to the main list, avoiding duplicates
      connectedEdges.push(...selectedEdgesSnapshots);
    });

    this.elementsSnapshot = {
      nodes: selectedElements.nodes,
      edges: connectedEdges,
    };
  }

  execute() {
    const selectedNodeIds = this.elementsSnapshot.nodes.map((node) => node.data.id);
    const selectedEdgeIds = this.elementsSnapshot.edges.map((edge) => edge.data.id);

    // Remove nodes and edges from the store
    selectedNodeIds.forEach((nodeId) => {
      useGraphDataStore.getState().removeNode(nodeId);
    });
    selectedEdgeIds.forEach((edgeId) => {
      useGraphDataStore.getState().removeEdge(edgeId);
    });

    // Remove edges first, then nodes from the canvas to avoid issues with connected edges
    graphService.removeElementsByIds(selectedEdgeIds);
    graphService.removeElementsByIds(selectedNodeIds);
  }

  undo() {
    // Restore nodes and edges to the store
    this.elementsSnapshot.nodes.forEach((nodeSnapshot) => {
      useGraphDataStore.getState().addNode(nodeSnapshot.data);
    });
    this.elementsSnapshot.edges.forEach((edgeSnapshot) => {
      useGraphDataStore.getState().addEdge(edgeSnapshot.data);
    });

    // Restore nodes first, then edges to the store
    graphService.addNodesToCy(this.elementsSnapshot.nodes);
    graphService.addEdgesToCy(this.elementsSnapshot.edges);
  }
}

export default BatchRemoveCommand;
