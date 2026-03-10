import type { GraphState, StoredStep, GraphNode } from "@/types/graph";
import { findSCCs } from "./scc";

export type AlgorithmCheckResult = {
  exists: boolean;
  reasons?: string[];
};

export interface FindEulerianCycleProps {
  params: {
    cyInstance: GraphState["cyInstance"];
    nodes: GraphState["nodes"];
    edges: GraphState["edges"];
    adjacencyList: ReturnType<GraphState["getAdjacencyList"]>;
    isDirected: GraphState["isDirected"];
  };
  startNodeId?: string;
}

export interface CheckEulerianCycle {
  params: Omit<FindEulerianCycleProps["params"], "cyInstance">;
}

function checkBalancedDegrees({
  nodes,
  edges,
}: {
  nodes: GraphState["nodes"];
  edges: GraphState["edges"];
}): AlgorithmCheckResult {
  const inDegrees: Map<string, number> = new Map();
  const outDegrees: Map<string, number> = new Map();

  nodes.forEach((node) => {
    inDegrees.set(node.id, 0);
    outDegrees.set(node.id, 0);
  });

  edges.forEach((edge) => {
    outDegrees.set(edge.source, (outDegrees.get(edge.source) || 0) + 1);
    inDegrees.set(edge.target, (inDegrees.get(edge.target) || 0) + 1);
  });

  const nodeErrorMessages: string[] = [];
  for (const node of nodes) {
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

function checkSCC({
  params,
}: {
  params: Pick<FindEulerianCycleProps["params"], "adjacencyList" | "nodes">;
}): AlgorithmCheckResult {
  const { adjacencyList, nodes } = params;
  const { components } = findSCCs({ adjacencyList });
  console.log("Strongly connected components:", components);

  const aloneNodes = new Set();
  nodes.forEach((node) => {
    if (!adjacencyList.get(node.id) || adjacencyList.get(node.id)!.length === 0) {
      aloneNodes.add(node.id);
    }
  });

  for (const component of components) {
    if (component.length === 1 && !aloneNodes.has(component[0])) {
      return {
        exists: false,
        reasons: [`Node ${component[0]} is not strongly connected to any other node.`],
      };
    }
  }

  return { exists: true };
}

function checkEulerianCycle({ params }: CheckEulerianCycle): AlgorithmCheckResult {
  const { nodes, edges, isDirected, adjacencyList } = params;

  if (nodes.length === 0) {
    return { exists: false, reasons: ["Graph is empty."] };
  }

  if (isDirected) {
    const balancedDegreesCheck = checkBalancedDegrees({ nodes, edges });
    const sccCheck = checkSCC({ params: { adjacencyList, nodes } });
    if (!balancedDegreesCheck.exists || !sccCheck.exists) {
      return {
        exists: false,
        reasons: [...(balancedDegreesCheck?.reasons || []), ...(sccCheck?.reasons || [])],
      };
    }
  } else {
    for (const node of nodes) {
      const degree = adjacencyList.get(node.id)?.length || 0;
      if (degree % 2 !== 0) {
        return {
          exists: false,
          reasons: [`Node ${node.id} has odd degree ${degree}.`],
        };
      }
    }
  }

  return { exists: true };
}

export function findEulerianCycle({ params, startNodeId }: FindEulerianCycleProps) {
  // const { cyInstance, nodes, isDirected, getAdjacencyList, checkEulerianCycle } = get();
  const { cyInstance, nodes, adjacencyList, isDirected } = params;
  const steps: StoredStep[] = [];

  // Logic to find Eulerian Cycle
  if (nodes.length === 0 || !cyInstance) {
    return { cycle: null, steps: [] };
  }

  const check = checkEulerianCycle({ params });
  console.log("Eulerian cycle check result:", check);
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
  const startNodeIndex = nodes.findIndex((n) => n.id === startNodeId);
  if (startNodeIndex !== -1) {
    startIndex = startNodeIndex;
  }

  // Hierholzer's Algorithm
  const circuit: GraphNode[] = [];
  const stack: GraphNode[] = [nodes[startIndex]];
  const visitedEdges = new Set<string>();

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [[2, 3, 4], 5],
      action: "traverse",
      message: [
        "Copy Graph and initialize stack",
        `Initializing stack with starting node ${nodes[startIndex].label}`,
      ],
      stack: [nodes[startIndex]],
      circuit: [],
    },
  });

  while (stack.length > 0) {
    const currentNode = stack[stack.length - 1];
    const currentNodeNeighbors = adjacencyList.get(currentNode.id) || [];

    if (currentNodeNeighbors.length > 0) {
      const nextNode = currentNodeNeighbors.pop()!;

      let processingEdge = cyInstance.edges(
        `edge[source = "${currentNode.id}"][target = "${nextNode.id}"]`,
      );
      if (processingEdge.length === 0 && !isDirected) {
        processingEdge = cyInstance.edges(
          `edge[source = "${nextNode.id}"][target = "${currentNode.id}"]`,
        );
      }

      const edgeId = Array.from(processingEdge)
        .find((edge) => !visitedEdges.has(edge.id()))
        ?.id();

      if (!edgeId) continue;

      if (!isDirected) {
        const nextNodeNeighbors = adjacencyList.get(nextNode.id) || [];
        const index = nextNodeNeighbors.indexOf(currentNode);
        if (index !== -1) nextNodeNeighbors.splice(index, 1);
      }

      steps.push({
        prev: {
          elements: [
            {
              type: "node",
              id: currentNode.id,
              label: currentNode.label,
              classes: cyInstance.getElementById(currentNode.id).classes(),
            },
            {
              type: "edge",
              id: edgeId,
              source: { type: "node", id: currentNode.id, label: currentNode.label },
              target: { type: "node", id: nextNode.id, label: nextNode.label },
              classes: cyInstance.getElementById(edgeId).classes(),
            },
          ],
        },
        current: {
          elements: [
            {
              type: "node",
              id: currentNode.id,
              label: currentNode.label,
              classes: ["exploring"],
            },
            {
              type: "edge",
              id: edgeId,
              source: { type: "node", id: currentNode.id, label: currentNode.label },
              target: { type: "node", id: nextNode.id, label: nextNode.label },
              classes: ["in-cycle"],
            },
          ],
          highlightedPseudoCodeLineIds: [[6, 7], 8, [9, 10], 11],
          action: "traverse",
          message: [
            `Exploring from node ${currentNode.label}`,
            `Traversing edge from ${currentNode.label} to ${nextNode.label}`,
            `Marking edge (${currentNode.label}, ${nextNode.label}) as visited`,
          ],
          stack: [...stack, nextNode],
          circuit: [...circuit],
        },
      });

      visitedEdges.add(edgeId);
      stack.push(nextNode);
    } else {
      circuit.push(stack.pop()!);
      steps.push({
        prev: {
          elements: [
            {
              type: "node",
              id: currentNode.id,
              label: currentNode.label,
              classes: cyInstance.getElementById(currentNode.id).classes(),
            },
          ],
        },
        current: {
          elements: [
            {
              type: "node",
              id: currentNode.id,
              label: currentNode.label,
              classes: ["in-cycle"],
            },
          ],
          highlightedPseudoCodeLineIds: [[6, 7], 12, 13, 14],
          action: "add-to-circuit",
          message: [
            `Exploring from node ${currentNode.label}`,
            `No more neighbors to explore from ${currentNode.label}`,
            `Added ${currentNode.label} to circuit`,
          ],
          stack: [...stack],
          circuit: [...circuit],
        },
      });
    }
  }

  circuit.reverse();

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [15, 16],
      action: "traverse",
      message: ["Reverse the circuit to get correct order", `Eulerian cycle found successfully.`],
      stack: [],
      circuit: [...circuit],
    },
  });

  return {
    cycle: circuit,
    steps: steps,
    message: "Eulerian cycle found successfully.",
  };
}
