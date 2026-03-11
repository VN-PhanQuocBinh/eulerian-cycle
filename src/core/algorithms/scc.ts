import { GraphNode, StoredStep, GraphState } from "@/types/graph";
import { getLabelById } from "@/utils";

interface SCCResult {
  components: string[][];
  steps: StoredStep[];
  message: string;
}

interface FindSCCParams {
  adjacencyList: ReturnType<GraphState["getAdjacencyList"]>;
  cyInstance: GraphState["cyInstance"];
}

interface RunSCCParams {
  cyInstance: GraphState["cyInstance"];
  steps: StoredStep[];
  u: string;
  adjacencyList: ReturnType<GraphState["getAdjacencyList"]>;
  disc: Map<string, number>;
  lowLink: Map<string, number>;
  stack: string[];
  inStack: Set<string>;
  timer: { value: number };
  allSCCs: string[][];
}

// Tarjan's algorithm implementation for finding strongly connected components
function runSCC({
  cyInstance,
  steps,
  u,
  adjacencyList,
  disc,
  lowLink,
  stack,
  inStack,
  timer,
  allSCCs,
}: RunSCCParams) {
  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [1],
      action: "traverse",
      message: ["Starting DFS from vertex u."],
      stack: [...stack],
    },
  });

  timer.value++;
  disc.set(u, timer.value);
  lowLink.set(u, timer.value);

  stack.push(u);
  inStack.add(u);

  steps.push({
    prev: {
      elements: [
        {
          type: "node",
          id: u,
          label: getLabelById(cyInstance, u),
          classes: ["exploring"],
        },
      ],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [2, 3],
      action: "traverse",
      message: [
        "Set discovery time and low link for vertex u",
        "Push u onto stack and mark as inStack.",
      ],
      stack: [...stack],
    },
  });

  const neighborIds = adjacencyList.get(u) || [];

  for (const neighborId of neighborIds) {
    steps.push({
      prev: {
        elements: [],
      },
      current: {
        elements: [],
        highlightedPseudoCodeLineIds: [4],
        action: "traverse",
        message: ["For each neighbor v of u."],
        stack: [...stack],
      },
    });

    if (!disc.has(neighborId)) {
      steps.push({
        prev: {
          elements: [],
        },
        current: {
          elements: [],
          highlightedPseudoCodeLineIds: [5, 6],
          action: "traverse",
          message: ["Neighbor v is not visited. Recursively DFS on v."],
          stack: [...stack],
        },
      });

      runSCC({
        steps,
        u: neighborId,
        adjacencyList,
        disc,
        lowLink,
        stack,
        inStack,
        timer,
        allSCCs,
      });

      const currentLowLink = lowLink.get(u);
      const neighborLowLink = lowLink.get(neighborId);

      lowLink.set(u, Math.min(currentLowLink!, neighborLowLink!));

      steps.push({
        prev: {
          elements: [],
        },
        current: {
          elements: [],
          highlightedPseudoCodeLineIds: [7],
          action: "traverse",
          message: ["Update low link for vertex u."],
          stack: [...stack],
        },
      });
    } else if (inStack.has(neighborId)) {
      const currentLowLink = lowLink.get(u);
      const neighborDisc = disc.get(neighborId);

      lowLink.set(u, Math.min(currentLowLink!, neighborDisc!));

      steps.push({
        prev: {
          elements: [],
        },
        current: {
          elements: [],
          highlightedPseudoCodeLineIds: [8, 9],
          action: "traverse",
          message: ["Neighbor v is in stack. Update low link for vertex u."],
          stack: [...stack],
        },
      });
    }
  }

  if (lowLink.get(u) === disc.get(u)) {
    const scc: string[] = [];

    while (true) {
      const w = stack.pop()!;
      inStack.delete(w);
      scc.push(w);

      if (w === u) break;
    }

    allSCCs.push(scc);

    steps.push({
      prev: {
        elements: [],
      },
      current: {
        elements: [],
        highlightedPseudoCodeLineIds: [10, 11, 12],
        action: "traverse",
        message: ["Found a strongly connected component."],
        stack: [...stack],
      },
    });
  }

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [13],
      action: "traverse",
      message: ["End of DFS for vertex u."],
      stack: [...stack],
    },
  });
}

export function findSCCs({ adjacencyList, cyInstance }: FindSCCParams): SCCResult {
  const steps: StoredStep[] = [];

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [14, 15],
      action: "traverse",
      message: ["Initialize discovery time and low link maps, stack, and timer."],
      stack: [],
    },
  });

  const disc = new Map<string, number>();
  const lowLink = new Map<string, number>();

  const stack: string[] = [];
  const inStack = new Set<string>();
  const timer = { value: 0 };

  const allSCCs: string[][] = [];

  for (const nodeId of adjacencyList.keys()) {
    steps.push({
      prev: {
        elements: [],
      },
      current: {
        elements: [],
        highlightedPseudoCodeLineIds: [16, 17],
        action: "traverse",
        message: ["Iterating over each vertex u in the graph.", `Checking if vertex u is visited.`],
        stack: [...stack],
      },
    });

    if (!disc.has(nodeId)) {
      steps.push({
        prev: {
          elements: [],
        },
        current: {
          elements: [],
          highlightedPseudoCodeLineIds: [18],
          action: "traverse",
          message: [`Vertex u is not visited.`],
          stack: [...stack],
        },
      });
      runSCC({
        cyInstance,
        steps,
        u: nodeId,
        adjacencyList,
        disc,
        lowLink,
        stack,
        inStack,
        timer,
        allSCCs,
      });
    }
  }

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [19],
      action: "traverse",
      message: ["Returning all strongly connected components found."],
      stack: [...stack],
    },
  });

  return {
    components: allSCCs,
    steps: [], // For simplicity, not implementing step-by-step animation for SCCs in this version
    message: `Found ${allSCCs.length} strongly connected component(s).`,
  };
}
