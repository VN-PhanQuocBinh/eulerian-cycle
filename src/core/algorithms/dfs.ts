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
      ],
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
          classes: ["scc-in-stack"],
        },
      ],
      message: [`Pushed node ${startNode?.label || startNodeId} onto the stack.`],
      stack: [...stack],
      visited: new Set(visited),
    });

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!;
      const currentNode = this.utils.getNode(currentNodeId);

      // If the current node has already been visited, skip it and continue to the next iteration
      if (visited.has(currentNodeId)) {
        steps.push({
          elements: [
            {
              type: "node",
              id: currentNodeId,
              label: currentNode?.label || currentNodeId,
              classes: ["scc-visiting"],
            },
          ],
          message: [`Node ${currentNodeId} has already been visited. Skipping.`],
          stack: [...stack],
          visited: new Set(visited),
        });
        continue;
      }

      // Found the target node, reconstruct the path and break the loop
      if (currentNodeId === targetNodeId) {
        let nodeId: string | null = currentNodeId;
        while (nodeId !== null) {
          path.unshift(nodeId);
          nodeId = parentMap.get(nodeId) || null;
        }

        steps.push({
          elements: [
            {
              type: "node",
              id: currentNodeId,
              label: currentNode?.label || currentNodeId,
              classes: ["scc-visiting"],
            },
          ],
          message: [`Found target node ${currentNode?.label || currentNodeId}.`],
          stack: [...stack],
          visited: new Set(visited),
        });

        break;
      }

      const neighors = this.adjacencyList.get(currentNodeId) || [];
      for (const neighbor of neighors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          parentMap.set(neighbor, currentNodeId);

          const currentNeighborNode = this.utils.getNode(neighbor);
          const currentEdge = this.utils.getEdges(currentNodeId, neighbor)[0];

          steps.push({
            elements: [
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
                classes: ["scc-visiting"],
              },
            ],
            message: [
              `Pushed neighbor node ${currentNeighborNode?.label || neighbor} onto the stack.`,
            ],
            stack: [...stack],
            visited: new Set(visited),
          });
        }
      }

      visited.add(currentNodeId);
    }

    steps.push({
      elements: [],
      message: [
        `DFS traversal from node ${startNode?.label || startNodeId} to node ${targetNode?.label || targetNodeId} completed.`,
      ],
      stack: [...stack],
      visited: new Set(visited),
    });

    return {
      result: {
        startNodeId,
        targetNodeId,
        path,
        found: false,
      },
      steps,
      message: `DFS traversal from node ${startNode?.label || startNodeId} to node ${targetNode?.label || targetNodeId} completed.`,
    };
  }
}
