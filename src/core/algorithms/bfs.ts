import { BfsResult } from "@/core/types/algorithm";
import { GraphData } from "@/types/graph-data-store";
import { createGraphUtils } from "../helpers/graph-utils";
import { Step } from "@/types/algorithm-store";
import { PathElementBuilder } from "@/core/helpers/path-element-builder";

export class BFS {
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

  execute(startNodeId: string, targetNodeId: string): BfsResult {
    if (this.nodes.length === 0) {
      return {
        result: {
          startNodeId,
          targetNodeId,
          path: [],
          traversalOrder: [],
          found: false,
        },
        steps: [],
        message: "Graph is empty. Please add nodes and edges to perform BFS.",
      };
    }

    const startNode = this.utils.getNode(startNodeId);
    const targetNode = this.utils.getNode(targetNodeId);

    const visited = new Set<string>();
    const queue: string[] = [];
    const parentMap: Map<string, string | null> = new Map();

    const steps: Step[] = [];
    const path: string[] = [];
    const traversalOrder: string[] = [];

    steps.push({
      elements: [],
      message: [
        `Starting BFS traversal from node ${startNode?.label || startNodeId} to find node ${targetNode?.label || targetNodeId}.`,
        "Initializing queue and visited set.",
      ],
      highlightedPseudoCodeLineIds: [1, [2, 3, 4]],
      stack: [...queue],
      visited: new Set(visited),
    });

    queue.push(startNodeId);
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
      message: [`Initialized queue with starting node ${startNode?.label || startNodeId}.`],
      highlightedPseudoCodeLineIds: [5, 6],
      stack: [...queue],
      visited: new Set(visited),
    });

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
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
            `Dequeue ${currentNode?.label || currentNodeId} from queue.`,
            `Node ${currentNodeId} has already been visited. Skipping.`,
          ],
          highlightedPseudoCodeLineIds: [8, 9],
          stack: [...queue],
          visited: new Set(visited),
        });
        continue;
      }

      visited.add(currentNodeId);
      traversalOrder.push(currentNodeId);

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
            `Dequeue ${currentNode?.label || currentNodeId} from queue.`,
            `Found target node ${currentNode?.label || currentNodeId}.`,
          ],
          highlightedPseudoCodeLineIds: [
            [8, 10],
            [11, 12],
          ],
          stack: [...queue],
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
          `Dequeue ${currentNode?.label || currentNodeId} from queue.`,
          `Visiting node ${currentNode?.label || currentNodeId}.`,
        ],
        highlightedPseudoCodeLineIds: [[8, 10]],
        stack: [...queue],
        visited: new Set(visited),
      });

      const neighors = this.adjacencyList.get(currentNodeId) || [];
      const visitedNeighbors: Step["elements"] = [];
      const neighborLabels: string[] = [];
      for (const neighbor of neighors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);

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
          `Enqueued neighbor${neighborLabels.length > 1 ? "s" : ""}: ${neighborLabels.join(", ")} into the queue.`,
        ],
        highlightedPseudoCodeLineIds: [13, 14, [15, 16]],
        stack: [...queue],
        visited: new Set(visited),
      });
    }

    // Construct the final step with the path highlighted
    const pathElementBuilder = new PathElementBuilder(this.utils);
    const inPathElements = pathElementBuilder.build(path, ["in-path"]);

    steps.push({
      elements: inPathElements,
      message: [
        `BFS traversal from node ${startNode?.label || startNodeId} to node ${targetNode?.label || targetNodeId} completed.`,
      ],
      highlightedPseudoCodeLineIds: [17],
      stack: [...queue],
      visited: new Set(visited),
    });

    return {
      result: {
        startNodeId,
        targetNodeId,
        path,
        traversalOrder,
        found: path.length > 0,
      },
      steps,
      message: `BFS traversal from node ${startNode?.label || startNodeId} to node ${targetNode?.label || targetNodeId} completed.`,
    };
  }
}
