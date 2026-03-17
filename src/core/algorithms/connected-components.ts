import { COMPONENT_COLORS } from "@/types/styles";
import { GraphData } from "@/types/graph-data-store";
import { Step } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";

export interface ConnectedComponentsResult {
  components: string[][];
  steps: Step[];
  message: string;
}

export interface FindConnectedComponentsParam {
  data: GraphData;
  startNodeId: string;
}

export function findConnectedComponents({
  data,
  startNodeId,
}: FindConnectedComponentsParam): ConnectedComponentsResult {
  const { getNode, getEdges, adjacencyList } = createGraphUtils(data);
  const startNodeExists = getNode(startNodeId) !== undefined;
  if (!startNodeExists) {
    return {
      components: [],
      steps: [],
      message: `Start node ID "${startNodeId}" not found. Starting from default node.`,
    };
  }

  const steps: ConnectedComponentsResult["steps"] = [];

  if (data.nodes.length === 0) {
    return {
      components: [],
      steps: [],
      message: "Graph is empty. Please add nodes and edges to run the algorithm.",
    };
  }

  const visited = new Set<string>();
  const components: string[][] = [];

  steps.push({
    elements: [],
    message: ["Initialize visited set and components list."],
    visited: new Set(visited),
    highlightedPseudoCodeLineIds: [12, 13],
  });

  // BFS with animation
  const animatedBFS = (startNodeId: string, componentIndex: number): string[] => {
    const queue: string[] = [startNodeId];
    const component: string[] = [];
    const startNodeElement = getNode(startNodeId)!;

    visited.add(startNodeId);

    steps.push({
      elements: [],
      message: [
        `Starting new component from node ${startNodeElement.label}.`,
        `Initialize queue with ${startNodeElement.label} and empty component list.`,
        `Mark ${startNodeElement.label} as visited and enqueue it.`,
        "Exploring neighbors and building component...",
      ],
      visited: new Set(visited),
      queue: [...queue],
      highlightedPseudoCodeLineIds: [14, [15, 16], 2, 3],
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);

      const currentNode = getNode(current)!;
      const neighborIds = adjacencyList.get(current) || [];
      const untreatedNeighbors = neighborIds.filter((neighborId) => !visited.has(neighborId));

      // Record step for visiting node
      steps.push({
        elements: [
          {
            type: "node",
            id: current,
            label: currentNode.label,
            classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
          },
        ],
        message: [
          `Visited node ${currentNode.label}`,
          `Find ${untreatedNeighbors.length} untreated neighbors.`,
        ],

        visited: new Set(visited),
        queue: [...queue],
        highlightedPseudoCodeLineIds: [4, [5, 6]],
      });

      for (const neighborId of untreatedNeighbors) {
        visited.add(neighborId);
        const neighborNode = getNode(neighborId)!;

        // Highlight edge being explored
        let processingEdge = getEdges(current, neighborId)!;
        if (processingEdge.length === 0 && !data.isDirected) {
          processingEdge = getEdges(neighborId, current)!;
        }

        // Enqueue neighbor
        queue.push(neighborId);

        steps.push({
          elements: [
            {
              type: "edge",
              id: processingEdge[0].id,
              source: {
                type: "node",
                id: current,
                label: currentNode.label,
              },
              target: {
                type: "node",
                id: neighborId,
                label: neighborNode.label,
              },
              classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
            },
          ],
          message: [
            `Visited edge from ${currentNode.label} to ${neighborNode.label}`,
            `Mark ${neighborNode.label} as visited and enqueue it.`,
          ],
          visited: new Set(visited),
          queue: [...queue],
          highlightedPseudoCodeLineIds: [7, [8, 9], 10],
        });
      }
    }

    return component;
  };

  // Start BFS from the first unvisited node
  const component = animatedBFS(startNodeId, 0);
  components.push(component);

  // Main algorithm loop
  for (let i = 0; i < data.nodes.length; i++) {
    const node = data.nodes[i];
    if (!visited.has(node.id)) {
      const component = animatedBFS(node.id, components.length);
      components.push(component);
    }
  }

  steps.push({
    elements: [],
    message: ["All nodes visited. Connected components identified."],
    visited: new Set(visited),
    highlightedPseudoCodeLineIds: [18],
  });

  return {
    components: [...components],
    steps,
    message: `Found ${components.length} connected component(s).`,
  };
}
