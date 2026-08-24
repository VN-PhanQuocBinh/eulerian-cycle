import { Command, GraphEdgeSnapshot, GraphNodeSnapshot } from "@/types/command";
import { CommandContext } from "@/services/command-context";

class BatchRemoveCommand implements Command {
  private elementsSnapshot: { nodes: GraphNodeSnapshot[]; edges: GraphEdgeSnapshot[] };

  constructor(private context: CommandContext) {
    const selectedElements = this.context.graphService.getSelectedElements();

    const connectedEdges: GraphEdgeSnapshot[] = [];
    const edgeIdsSet = new Set<string>(); // To avoid duplicates when collecting connected edges

    selectedElements.edges.forEach((edge) => {
      const edgeSnapshot = this.context.graphService.getEdgeSnapshotById(edge.data.id);
      if (!edgeSnapshot) {
        throw new Error(
          `Cannot create BatchRemoveCommand: selected edge with ID ${edge.data.id} does not exist.`,
        );
      }
      connectedEdges.push(edgeSnapshot);
    });

    selectedElements.nodes.forEach((node) => {
      const selectedEdges = this.context.graphDataStore.getEdgesByNodeId(node.data.id);
      const selectedEdgesSnapshots: GraphEdgeSnapshot[] = [];

      // Collect snapshots of connected edges for each selected node
      selectedEdges.forEach((edge) => {
        const edgeSnapshot = this.context.graphService.getEdgeSnapshotById(edge.id);
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
      this.context.graphDataStore.removeNode(nodeId);
    });
    selectedEdgeIds.forEach((edgeId) => {
      this.context.graphDataStore.removeEdge(edgeId);
    });

    // Remove edges first, then nodes from the canvas to avoid issues with connected edges
    this.context.graphService.removeElementsByIds(selectedEdgeIds);
    this.context.graphService.removeElementsByIds(selectedNodeIds);
  }

  undo() {
    // Restore nodes and edges to the store
    this.elementsSnapshot.nodes.forEach((nodeSnapshot) => {
      this.context.graphDataStore.addNode(nodeSnapshot.data);
    });
    this.elementsSnapshot.edges.forEach((edgeSnapshot) => {
      this.context.graphDataStore.addEdge(edgeSnapshot.data);
    });

    // Restore nodes first, then edges to the store
    this.context.graphService.addNodesToCy(this.elementsSnapshot.nodes);
    this.context.graphService.addEdgesToCy(this.elementsSnapshot.edges);
  }
}

export default BatchRemoveCommand;
