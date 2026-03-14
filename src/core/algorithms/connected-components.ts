import type { StoredStep, GraphState } from "@/types/graph";
import { COMPONENT_COLORS } from "@/types/styles";

export interface ConnectedComponentsResult {
  components: string[][];
  steps: StoredStep[];
  message: string;
}

export interface findConnectedComponentsProps {
  params: {
    cyInstance: GraphState["cyInstance"];
    adjacencyList: ReturnType<GraphState["getAdjacencyList"]>;
    nodes: GraphState["nodes"];
  };
  startNodeId: string;
}

export function findConnectedComponents({
  params,
  startNodeId,
}: findConnectedComponentsProps): ConnectedComponentsResult {
  const { nodes, cyInstance, adjacencyList } = params;
  const startNodeExists = nodes.some((n) => n.id === startNodeId);
  if (!startNodeExists) {
    return {
      components: [],
      steps: [],
      message: `Start node ID "${startNodeId}" not found. Starting from default node.`,
    };
  }

  const steps: ConnectedComponentsResult["steps"] = [];

  if (nodes.length === 0 || !cyInstance) {
    return {
      components: [],
      steps: [],
      message: "Graph is empty. Please add nodes and edges to run the algorithm.",
    };
  }

  const visited = new Set<string>();
  const components: string[][] = [];

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      action: "component-complete",
      message: ["Initialize visited set and components list."],
      visited: new Set(visited),
      highlightedPseudoCodeLineIds: [12, 13],
    },
  });

  // BFS with animation
  const animatedBFS = (startNodeId: string, componentIndex: number): string[] => {
    const queue: string[] = [startNodeId];
    const component: string[] = [];
    const startNodeElement = cyInstance.getElementById(startNodeId);

    visited.add(startNodeId);

    steps.push({
      prev: {
        elements: [],
      },
      current: {
        elements: [],
        action: "traverse",
        message: [
          `Starting new component from node ${startNodeElement.data("label")}.`,
          `Initialize queue with ${startNodeElement.data("label")} and empty component list.`,
          `Mark ${startNodeElement.data("label")} as visited and enqueue it.`,
          "Exploring neighbors and building component...",
        ],
        visited: new Set(visited),
        queue: [...queue],
        highlightedPseudoCodeLineIds: [14, [15, 16], 2, 3],
      },
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);

      const currentNode = cyInstance.getElementById(current);
      const neighborIds = adjacencyList.get(current) || [];
      const untreatedNeighbors = neighborIds.filter((neighborId) => !visited.has(neighborId));

      // Record step for visiting node
      steps.push({
        prev: {
          elements: [
            {
              type: "node",
              id: current,
              label: currentNode.data("label"),
              classes: currentNode.classes(),
            },
          ],
        },
        current: {
          elements: [
            {
              type: "node",
              id: current,
              label: currentNode.data("label"),
              classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
            },
          ],
          action: "visit",
          message: [
            `Visited node ${currentNode.data("label")}`,
            `Find ${untreatedNeighbors.length} untreated neighbors.`,
          ],

          visited: new Set(visited),
          queue: [...queue],
          highlightedPseudoCodeLineIds: [4, [5, 6]],
        },
      });
      
      for (const neighborId of neighborIds) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          const neighborNode = cyInstance.getElementById(neighborId);

          // Highlight edge being explored
          let processingEdge = cyInstance.edges(`[source="${current}"][target="${neighborId}"]`);
          if (processingEdge.length === 0) {
            processingEdge = cyInstance.edges(`[source="${neighborId}"][target="${current}"]`);
          }

          // Enqueue neighbor
          queue.push(neighborId);

          steps.push({
            prev: {
              elements: [
                {
                  type: "edge",
                  id: processingEdge[0].id(),
                  source: {
                    type: "node",
                    id: current,
                    label: currentNode.data("label"),
                  },
                  target: {
                    type: "node",
                    id: neighborId,
                    label: neighborNode.data("label"),
                  },
                  classes: processingEdge[0].classes(),
                },
              ],
            },
            current: {
              elements: [
                {
                  type: "edge",
                  id: processingEdge[0].id(),
                  source: {
                    type: "node",
                    id: current,
                    label: currentNode.data("label"),
                  },
                  target: {
                    type: "node",
                    id: neighborId,
                    label: neighborNode.data("label"),
                  },
                  classes: [`component-${componentIndex % COMPONENT_COLORS.length}`],
                },
              ],
              action: "visit",
              message: [
                `Visited edge from ${currentNode.data("label")} to ${neighborNode.data("label")}`,
                `Mark ${neighborNode.data("label")} as visited and enqueue it.`,
              ],
              visited: new Set(visited),
              queue: [...queue],
              highlightedPseudoCodeLineIds: [7, [8, 9], 10],
            },
          });
        }
      }
    }

    return component;
  };

  // Start BFS from the first unvisited node
  const component = animatedBFS(startNodeId, 0);
  components.push(component);

  // Main algorithm loop
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!visited.has(node.id)) {
      const component = animatedBFS(node.id, components.length);
      components.push(component);
    }
  }

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      action: "traverse",
      message: ["All nodes visited. Connected components identified."],
      visited: new Set(visited),
      highlightedPseudoCodeLineIds: [18],
    },
  });

  console.log("Final Connected Components:", components);

  return {
    components,
    steps,
    message: `Found ${components.length} connected component(s).`,
  };
}
