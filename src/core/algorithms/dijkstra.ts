import { PathElementBuilder } from "@/core/helpers/path-element-builder";
import { MinHeap } from "@/core/helpers/min-heap";
import { GraphData } from "@/types/graph-data-store";
import { createGraphUtils } from "../helpers/graph-utils";
import { Step } from "@/types/algorithm-store";
import { DijkstraResult } from "@/core/types/algorithm";

export class Dijkstra {
  readonly graphUtils: ReturnType<typeof createGraphUtils>;

  constructor(private graphData: GraphData) {
    this.graphUtils = createGraphUtils(this.graphData);
  }

  execute(startNodeId: string, targetNodeId?: string): DijkstraResult {
    const startNode = this.graphUtils.getNode(startNodeId);
    const targetNode = targetNodeId ? this.graphUtils.getNode(targetNodeId) : undefined;

    if (this.graphData.nodes.length === 0 || !startNode) {
      return {
        result: {
          startNodeId,
          targetNodeId,
          shortestPath: [],
          shortestDistance: Infinity,
          distances: new Map(),
          previousNodes: new Map(),
          found: false,
        },
        steps: [],
        message: "Graph is empty. Please add nodes and edges to perform Dijkstra's algorithm.",
      };
    }

    const priorityQueue = new MinHeap();
    const distances = new Map<string, number>();
    const previousNodes = new Map<string, string | null>();
    const steps: Step[] = [];
    const shortestPath: string[] = [];

    for (const node of this.graphData.nodes) {
      distances.set(node.id, node.id === startNodeId ? 0 : Infinity);
      previousNodes.set(node.id, null);
    }

    const snapshot = () => ({
      distances: new Map(distances),
      previousNodes: new Map(previousNodes),
    });

    steps.push({
      elements: [],
      message: [
        `Starting Dijkstra's algorithm from node ${startNode?.label || startNode?.id || startNodeId}${targetNodeId ? ` to find node ${targetNode?.label || targetNode?.id || targetNodeId}` : ""}.`,
      ],
      highlightedPseudoCodeLineIds: [],
      ...snapshot(),
    });

    priorityQueue.push({ id: startNodeId, priority: 0 });

    steps.push({
      elements: [],
      message: [
        `Initialized distances and previous nodes for all nodes.`,
        `Added start node ${this.graphUtils.getNode(startNodeId)?.label || startNodeId} to the priority queue.`,
      ],
      highlightedPseudoCodeLineIds: [],
      ...snapshot(),
    });

    while (priorityQueue.size > 0) {
      const current = priorityQueue.pop();
      if (!current) break;
      const currentNode = this.graphUtils.getNode(current.id);
      const previousNode = this.graphUtils.getNode(previousNodes.get(current.id) || "");
      const visitedEdge = this.graphUtils.getEdges(
        previousNode?.id || "",
        currentNode?.id || "",
      )[0];

      if (!currentNode) continue;

      if (currentNode.id === targetNodeId) {
        let currentPathId = targetNodeId;
        while (currentPathId) {
          shortestPath.unshift(currentPathId);
          currentPathId = previousNodes.get(currentPathId) || "";
        }

        steps.push({
          currentNode: {
            type: "node",
            id: currentNode.id,
            label: currentNode.label || currentNode.id,
            classes: ["visited"],
          },
          elements: [
            {
              type: "node",
              id: currentNode.id,
              label: currentNode.label || currentNode.id,
              classes: ["visited"],
            },
          ],
          message: [
            `Target node ${targetNode?.label || targetNode?.id} found. Dijkstra's algorithm completed.`,
          ],
          highlightedPseudoCodeLineIds: [],
          ...snapshot(),
        });
        break;
      }

      if (current.priority > distances.get(currentNode.id)!) {
        // steps.push({
        //   currentNode: {
        //     type: "node",
        //     id: currentNode.id,
        //     label: currentNode.label || currentNode.id,
        //     classes: ["visited"],
        //   },
        //   elements: [],
        //   message: [
        //     `Skipping node ${currentNode.label || currentNode.id} as a shorter path has already been found.`,
        //   ],
        //   ...snapshot(),
        // });

        continue;
      }

      steps.push({
        currentNode: {
          type: "node",
          id: currentNode.id,
          label: currentNode.label || currentNode.id,
          classes: ["visited"],
        },
        elements: [
          {
            type: "node",
            id: currentNode.id,
            label: currentNode.label || currentNode.id,
            classes: ["visited"],
          },
          previousNode &&
            visitedEdge &&
            ({
              type: "edge",
              id: visitedEdge.id,
              source: {
                type: "node",
                id: previousNode.id,
                label: previousNode.label || previousNode.id,
              },
              target: {
                type: "node",
                id: currentNode.id,
                label: currentNode.label || currentNode.id,
              },
              classes: ["visited"],
            } satisfies Step["elements"][number]),
        ].filter(Boolean) as Step["elements"],
        message: [`Processing node ${currentNode.label || currentNode.id}.`],
        highlightedPseudoCodeLineIds: [],
        ...snapshot(),
      });

      const neighborIds = this.graphUtils.getNeighbors(currentNode.id);
      for (const neighbor of neighborIds) {
        const [edge] = this.graphUtils.getEdges(currentNode.id, neighbor);
        if (!edge) continue;

        const newDistance = distances.get(currentNode.id)! + edge.weight;
        if (newDistance < distances.get(neighbor)!) {
          const neighborNode = this.graphUtils.getNode(neighbor);
          if (!neighborNode) continue;

          distances.set(neighbor, newDistance);
          previousNodes.set(neighbor, currentNode.id);
          priorityQueue.push({ id: neighbor, priority: newDistance });

          steps.push({
            elements: [
              {
                type: "edge",
                id: edge.id,
                source: {
                  type: "node",
                  id: currentNode.id,
                  label: currentNode.label || currentNode.id,
                },
                target: {
                  type: "node",
                  id: neighbor,
                  label: neighborNode.label || neighbor,
                },
                classes: ["relaxed"],
              },
              {
                type: "node",
                id: neighbor,
                label: neighborNode.label || neighbor,
                classes: ["relaxed"],
              },
            ],
            message: [
              `Updated distance for node ${neighborNode.label || neighbor} to ${newDistance}.`,
              `Previous node is now ${currentNode.label || currentNode.id}.`,
            ],
            highlightedPseudoCodeLineIds: [],
            ...snapshot(),
          });
        }
      }
    }

    const pathElementBuilder = new PathElementBuilder(this.graphUtils);
    const shortestPathElements = pathElementBuilder.build(shortestPath, ["in-shortest-path"]);

    steps.push({
      elements: shortestPathElements,
      message: [`Dijkstra's algorithm completed.`],
      highlightedPseudoCodeLineIds: [],
      ...snapshot(),
    });

    return {
      result: {
        startNodeId,
        targetNodeId,
        shortestPath: [],
        shortestDistance: Infinity,
        distances,
        previousNodes,
        found: false,
      },
      steps,
      message: "Dijkstra's algorithm completed.",
    };
  }
}
