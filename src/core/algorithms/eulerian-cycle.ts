import { GraphNode, GraphEdge } from "@/types/graph-data-store";
import { Step } from "@/types/algorithm-store";
import { TarjanSCC } from "@/core/algorithms/tarjan-scc";
import { GraphData } from "@/types/graph-data-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";

export type AlgorithmCheckResult = {
  exists: boolean;
  reasons?: string[];
};

export interface FindEulerianCycleProps {
  data: GraphData;
  startNodeId?: string;
}

export interface CheckEulerianCycle extends Omit<FindEulerianCycleProps, "startNodeId"> {}

export class EulerianCycle {
  readonly utils: ReturnType<typeof createGraphUtils>;
  readonly nodes: GraphNode[] = [];
  readonly edges: GraphEdge[] = [];
  readonly isDirected: boolean = true;
  readonly adjacencyList: Map<string, string[]> = new Map();

  steps: Step[] = [];

  constructor(data: GraphData) {
    this.utils = createGraphUtils(data);
    this.nodes = data.nodes;
    this.edges = data.edges;
    this.isDirected = data.isDirected;
    this.adjacencyList = this.utils.adjacencyList;
  }

  checkBalancedDegrees() {
    const inDegrees: Map<string, number> = new Map();
    const outDegrees: Map<string, number> = new Map();

    this.nodes.forEach((node) => {
      inDegrees.set(node.id, 0);
      outDegrees.set(node.id, 0);
    });

    this.edges.forEach((edge) => {
      outDegrees.set(edge.source, (outDegrees.get(edge.source) || 0) + 1);
      inDegrees.set(edge.target, (inDegrees.get(edge.target) || 0) + 1);
    });

    const nodeErrorMessages: string[] = [];
    for (const node of this.nodes) {
      if (inDegrees.get(node.id) !== outDegrees.get(node.id)) {
        nodeErrorMessages.push(
          `Node ${node.label} has in-degree ${inDegrees.get(node.id)} ≠ out-degree ${outDegrees.get(node.id)}.`,
        );
      }
    }

    if (nodeErrorMessages.length > 0) {
      return {
        exists: false,
        reasons: nodeErrorMessages,
      };
    }

    return { exists: true };
  }

  checkSCC(startNodeId: string): AlgorithmCheckResult {
    const { components } = new TarjanSCC({
      nodes: this.nodes,
      edges: this.edges,
      isDirected: this.isDirected,
    }).execute(startNodeId);

    const circuitArea: Set<string> = new Set();
    const aloneNodes = new Set();

    this.nodes.forEach((node) => {
      if (!this.adjacencyList.get(node.id) || this.adjacencyList.get(node.id)!.length === 0) {
        aloneNodes.add(node.id);
      }
    });

    for (const component of components) {
      if (component.length === 1 && !aloneNodes.has(component[0])) {
        return {
          exists: false,
          reasons: [`Node ${component[0]} is not strongly connected to any other node.`],
        };
      } else if (component.length > 1) {
        component.forEach((nodeId) => circuitArea.add(nodeId));
      }
    }

    return { exists: true };
  }

  checkEulerianCycle(startNodeId: string): AlgorithmCheckResult {
    if (this.nodes.length === 0) {
      return { exists: false, reasons: ["Graph is empty."] };
    }

    const circuitArea: Set<string> = new Set();

    if (this.isDirected) {
      const balancedDegreesCheck = this.checkBalancedDegrees();
      const sccCheck = this.checkSCC(startNodeId);
      if (!balancedDegreesCheck.exists || !sccCheck.exists) {
        return {
          exists: false,
          reasons: [...(balancedDegreesCheck?.reasons || []), ...(sccCheck?.reasons || [])],
        };
      }
    } else {
      for (const node of this.nodes) {
        const degree = this.adjacencyList.get(node.id)?.length || 0;
        if (degree % 2 !== 0) {
          return {
            exists: false,
            reasons: [`Node ${node.id} has odd degree ${degree}.`],
          };
        }

        circuitArea.add(node.id);
      }
    }

    return { exists: true };
  }

  execute(startNodeId: string) {
    // Logic to find Eulerian Cycle
    if (this.nodes.length === 0) {
      return { cycle: null, steps: [] };
    }

    const check = this.checkEulerianCycle(startNodeId);
    if (!check.exists) {
      return { cycle: null, steps: [], message: check.reasons };
    }

    // Initialize starting point
    if (!startNodeId) {
      return {
        cycle: null,
        steps: [],
        message: `Start node ID ${startNodeId} not found. Starting from default node.`,
      };
    }

    let startIndex = 0;
    const startNodeIndex = this.nodes.findIndex((n) => n.id === startNodeId);
    if (startNodeIndex !== -1) {
      startIndex = startNodeIndex;
    }

    // Hierholzer's Algorithm
    const circuit: string[] = [];
    const stack: string[] = [this.nodes[startIndex].id];
    const visitedEdgeStack: string[] = [];
    const visitedEdges = new Set<string>();

    this.steps.push({
      elements: [],
      highlightedPseudoCodeLineIds: [[2, 3, 4], 5],
      message: [
        "Copy Graph and initialize stack",
        `Initializing stack with starting node ${this.nodes[startIndex].label}`,
      ],
      stack: [this.nodes[startIndex].id],
      circuit: [],
    });

    while (stack.length > 0) {
      const currentNodeId = stack[stack.length - 1];
      const currentNodeNeighbors = this.adjacencyList.get(currentNodeId) || [];

      if (currentNodeNeighbors.length > 0) {
        const nextNodeId = currentNodeNeighbors.pop()!;

        let processingEdge = this.utils.getEdges(currentNodeId, nextNodeId);
        if (processingEdge.length === 0 && !this.isDirected) {
          processingEdge = this.utils.getEdges(nextNodeId, currentNodeId);
        }

        const edgeId = Array.from(processingEdge).find((edge) => !visitedEdges.has(edge.id))?.id;

        if (!edgeId) continue;

        if (!this.isDirected) {
          const nextNodeNeighbors = this.adjacencyList.get(nextNodeId) || [];
          const index = nextNodeNeighbors.indexOf(currentNodeId);
          if (index !== -1) nextNodeNeighbors.splice(index, 1);
        }

        const currentNodeLabel = this.utils.getNode(currentNodeId)?.label || currentNodeId;
        const nextNodeLabel = this.utils.getNode(nextNodeId)?.label || nextNodeId;
        this.steps.push({
          elements: [
            {
              type: "node",
              id: currentNodeId,
              label: currentNodeLabel,
              classes: ["exploring"],
            },
            {
              type: "edge",
              id: edgeId,
              source: {
                type: "node",
                id: currentNodeId,
                label: currentNodeLabel,
              },
              target: { type: "node", id: nextNodeId, label: nextNodeLabel },
              classes: ["in-cycle"],
            },
          ],
          highlightedPseudoCodeLineIds: [[6, 7], 8, [9, 10], 11],
          message: [
            `Exploring from node ${currentNodeLabel}`,
            `Traversing edge from ${currentNodeLabel} to ${nextNodeLabel}`,
            `Marking edge (${currentNodeLabel}, ${nextNodeLabel}) as visited`,
          ],
          stack: [...stack, nextNodeId],
          circuit: [...circuit],
        });

        visitedEdges.add(edgeId);
        stack.push(nextNodeId);
        visitedEdgeStack.push(edgeId);
      } else {
        circuit.push(stack.pop()!);

        const currentNodeLabel = this.utils.getNode(currentNodeId)?.label || currentNodeId;
        const currentEdgeId = visitedEdgeStack.length > 0 ? visitedEdgeStack.pop()! : null;
        const currentEdge = currentEdgeId && this.utils.getEdgeById(currentEdgeId);

        const stepElements = [
          {
            type: "node",
            id: currentNodeId,
            label: this.utils.getNode(currentNodeId)?.label || currentNodeId,
            classes: ["in-cycle"],
          },
          currentEdge && {
            type: "edge",
            id: currentEdge.id,
            source: {
              type: "node",
              id: currentEdge.source,
              label: this.utils.getNode(currentEdge.source)?.label || currentEdge.source,
            },
            target: {
              type: "node",
              id: currentEdge.target,
              label: this.utils.getNode(currentEdge.target)?.label || currentEdge.target,
            },
            label: stack.length.toString(),
            classes: ["in-cycle"],
          },
        ].filter(Boolean) as Step["elements"];

        this.steps.push({
          elements: stepElements,
          highlightedPseudoCodeLineIds: [[6, 7], 12, 13, 14],
          message: [
            `Exploring from node ${currentNodeLabel}`,
            `No more neighbors to explore from ${currentNodeLabel}`,
            `Added ${currentNodeLabel} to circuit`,
          ],
          stack: [...stack],
          circuit: [...circuit],
        });

        
      }
    }

    circuit.reverse();

    this.steps.push({
      elements: [],
      highlightedPseudoCodeLineIds: [15, 16],
      message: ["Reverse the circuit to get correct order", `Eulerian cycle found successfully.`],
      stack: [],
      circuit: [...circuit],
    });

    return {
      cycle: circuit,
      steps: this.steps,
      message: "Eulerian cycle found successfully.",
    };
  }
}
