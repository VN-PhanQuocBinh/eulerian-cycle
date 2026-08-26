import { GraphData } from "@/types/graph-data-store";
import { AlgorithmResult } from "../types/algorithm";
import { createGraphUtils } from "../helpers/graph-utils";
import { Step } from "@/types/algorithm-store";

interface DFSResult {
  startNodeId: string;
  targetNodeId: string;
  path: string[];
  found: boolean;
}

export class DFS {
  private utils: ReturnType<typeof createGraphUtils>;
  readonly nodes: string[];
  readonly edges: string[];
  readonly isDirected: boolean;
  readonly adjacencyList: Map<string, string[]>;

  constructor(graph: GraphData) {
    this.utils = createGraphUtils(graph);
    this.nodes = graph.nodes.map((node) => node.id);
    this.edges = graph.edges.map((edge) => edge.id);
    this.isDirected = graph.isDirected;
    this.adjacencyList = this.utils.adjacencyList;
  }

  execute(startNodeId: string, targetNodeId: string): AlgorithmResult<DFSResult> {
    if (this.nodes.length === 0) {
      return {
        result: {
          startNodeId,
          targetNodeId,
          path: [],
          found: false,
        },
        steps: [],
        message: "Graph is empty. Please add nodes and edges to perform DFS.",
      };
    }

    const startNode = this.utils.getNode(startNodeId);
    const targetNode = this.utils.getNode(targetNodeId);

    const visited = new Set<string>();
    const stack: string[] = [];
    const parentMap: Map<string, string | null> = new Map();

    const steps: Step[] = [];
    const path: string[] = [];

    steps.push({
      elements: [],
      message: [
        `Starting DFS traversal from node ${startNode?.label || startNodeId} to find node ${targetNode?.label || targetNodeId}.`,
        "Initializing stack and visited set.",
      ],
      highlightedPseudoCodeLineIds: [1, [2, 3, 4]],
      stack: [...stack],
      visited: new Set(visited),
    });

    stack.push(startNodeId);
    parentMap.set(startNodeId, null);

    steps.push({
      elements: [
        {
          type: "node",
          id: startNodeId,
          label: startNode?.label || startNodeId,
          classes: ["processing-neighbor"],
        },
      ],
      message: [`Initialized stack with starting node ${startNode?.label || startNodeId}.`],
      highlightedPseudoCodeLineIds: [5, 6],
      stack: [...stack],
      visited: new Set(visited),
    });

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!;
      const currentNode = this.utils.getNode(currentNodeId);
      const currentStepNode: Step["currentNode"] = {
        type: "node",
        id: currentNodeId,
        label: currentNode?.label || currentNodeId,
        classes: ["visiting-neighbor"],
      };

      // If the current node has already been visited, skip it and continue to the next iteration
      if (visited.has(currentNodeId)) {
        steps.push({
          elements: [
            {
              type: "node",
              id: currentNodeId,
              label: currentNode?.label || currentNodeId,
              classes: ["visiting-neighbor"],
            },
          ],
          message: [
            `Pop ${currentNode?.label || currentNodeId} from stack.`,
            `Node ${currentNodeId} has already been visited. Skipping.`,
          ],
          highlightedPseudoCodeLineIds: [8, 9],
          stack: [...stack],
          visited: new Set(visited),
        });
        continue;
      }

      visited.add(currentNodeId);

      // Found the target node, reconstruct the path and break the loop
      if (currentNodeId === targetNodeId) {
        let nodeId: string | null = currentNodeId;
        while (nodeId !== null) {
          path.unshift(nodeId);
          nodeId = parentMap.get(nodeId) || null;
        }

        steps.push({
          currentNode: currentStepNode,
          elements: [
            {
              type: "node",
              id: currentNodeId,
              label: currentNode?.label || currentNodeId,
              classes: ["visiting-neighbor"],
            },
          ],
          message: [
            `Pop ${currentNode?.label || currentNodeId} from stack.`,
            `Found target node ${currentNode?.label || currentNodeId}.`,
          ],
          highlightedPseudoCodeLineIds: [[8, 10], [11, 12]],
          stack: [...stack],
          visited: new Set(visited),
        });

        break;
      }

      steps.push({
        currentNode: currentStepNode,
        elements: [
          {
            type: "node",
            id: currentNodeId,
            label: currentNode?.label || currentNodeId,
            classes: ["visiting-neighbor"],
          },
        ],
        message: [
          `Pop ${currentNode?.label || currentNodeId} from stack.`,
          `Visiting node ${currentNode?.label || currentNodeId}.`,
        ],
        highlightedPseudoCodeLineIds: [[8, 10]],
        stack: [...stack],
        visited: new Set(visited),
      });

      const neighors = this.adjacencyList.get(currentNodeId) || [];
      const visitedNeighbors: Step["elements"] = [];
      const neighborLabels: string[] = [];
      for (const neighbor of neighors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);

          if (!parentMap.has(neighbor)) {
            parentMap.set(neighbor, currentNodeId);
          }

          const currentNeighborNode = this.utils.getNode(neighbor);
          const currentEdge = this.utils.getEdges(currentNodeId, neighbor)[0];

          visitedNeighbors.push(
            {
              type: "edge",
              id: currentEdge?.id || "PLACEHOLDER_EDGE_ID",
              source: {
                type: "node",
                id: currentNodeId,
                label: currentNode?.label || currentNodeId,
              },
              target: {
                type: "node",
                id: neighbor,
                label: currentNeighborNode?.label || neighbor,
              },
              classes: ["processing-neighbor"],
            },
            {
              type: "node",
              id: neighbor,
              label: currentNeighborNode?.label || neighbor,
              classes: ["processing-neighbor"],
            },
          );
          neighborLabels.push(currentNeighborNode?.label || neighbor);
        }
      }

      steps.push({
        currentNode: currentStepNode,
        elements: visitedNeighbors,
        message: [
          `Pushed neighbor${neighborLabels.length > 1 ? "s" : ""}: ${neighborLabels.join(", ")} onto the stack.`,
        ],
        highlightedPseudoCodeLineIds: [13, 14, [15, 16]],
        stack: [...stack],
        visited: new Set(visited),
      });
    }

    steps.push({
      elements: [],
      message: [
        `DFS traversal from node ${startNode?.label || startNodeId} to node ${targetNode?.label || targetNodeId} completed.`,
      ],
      highlightedPseudoCodeLineIds: [17],
      stack: [...stack],
      visited: new Set(visited),
    });

    return {
      result: {
        startNodeId,
        targetNodeId,
        path,
        found: path.length > 0,
      },
      steps,
      message: `DFS traversal from node ${startNode?.label || startNodeId} to node ${targetNode?.label || targetNodeId} completed.`,
    };
  }
}
