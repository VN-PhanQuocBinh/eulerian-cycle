import { COMPONENT_COLORS } from "@/types/styles";
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

const getClassesForNode = (cyInstance: GraphState["cyInstance"], nodeId: string): string[] => {
  const node = cyInstance?.getElementById(nodeId);
  if (!node) return [];
  const classes = node.classes();
  return classes;
};

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
  if (!cyInstance) return;

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
          classes: getClassesForNode(cyInstance, u),
        },
      ],
    },
    current: {
      elements: [
        {
          type: "node",
          id: u,
          label: getLabelById(cyInstance, u),
          classes: ["scc-in-stack"],
        },
      ],
      highlightedPseudoCodeLineIds: [1, 2, 3, 4],
      action: "traverse",
      message: [
        `Set discovery time and low link for vertex ${getLabelById(cyInstance, u)} to ${timer.value}.`,
        `Push ${getLabelById(cyInstance, u)} onto stack and mark as inStack.`,
        `For each neighbor v of ${getLabelById(cyInstance, u)}.`,
      ],
      stack: [...stack],
      dsc: new Map(disc),
      lowLink: new Map(lowLink),
    },
  });

  const neighborIds = adjacencyList.get(u) || [];

  for (const neighborId of neighborIds) {
    const processingEdge = cyInstance.edges(`[source="${u}"][target="${neighborId}"]`);
    if (disc.get(neighborId) === -1) {
      steps.push({
        prev: {
          elements: [
            {
              type: "edge",
              id: processingEdge[0].id(),
              source: {
                type: "node",
                id: u,
                label: getLabelById(cyInstance, u),
              },
              target: {
                type: "node",
                id: neighborId,
                label: getLabelById(cyInstance, neighborId),
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
                id: u,
                label: getLabelById(cyInstance, u),
              },
              target: {
                type: "node",
                id: neighborId,
                label: getLabelById(cyInstance, neighborId),
              },
              classes: ["scc-visiting"],
            },
          ],
          highlightedPseudoCodeLineIds: [5, 6],
          action: "traverse",
          message: [
            `Neighbor ${getLabelById(cyInstance, neighborId)} is not visited. Recursively DFS on ${getLabelById(cyInstance, neighborId)}.`,
          ],
          stack: [...stack],
          dsc: new Map(disc),
          lowLink: new Map(lowLink),
        },
      });

      runSCC({
        cyInstance,
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
          message: [`Update low link for vertex ${getLabelById(cyInstance, u)}.`],
          stack: [...stack],
          dsc: new Map(disc),
          lowLink: new Map(lowLink),
        },
      });
    } else if (inStack.has(neighborId)) {
      const currentLowLink = lowLink.get(u);
      const neighborDisc = disc.get(neighborId);

      lowLink.set(u, Math.min(currentLowLink!, neighborDisc!));

      steps.push({
        prev: {
          elements: [
            {
              type: "edge",
              id: processingEdge[0].id(),
              source: {
                type: "node",
                id: u,
                label: getLabelById(cyInstance, u),
              },
              target: {
                type: "node",
                id: neighborId,
                label: getLabelById(cyInstance, neighborId),
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
                id: u,
                label: getLabelById(cyInstance, u),
              },
              target: {
                type: "node",
                id: neighborId,
                label: getLabelById(cyInstance, neighborId),
              },
              classes: ["scc-visiting"],
            },
          ],
          highlightedPseudoCodeLineIds: [8, 9],
          action: "traverse",
          message: [
            `Neighbor ${getLabelById(cyInstance, neighborId)} is in stack.`,
            `Update low link for vertex ${getLabelById(cyInstance, u)}.`,
          ],
          stack: [...stack],
          dsc: new Map(disc),
          lowLink: new Map(lowLink),
        },
      });
    }
  }

  if (lowLink.get(u) === disc.get(u)) {
    steps.push({
      prev: {
        elements: [],
      },
      current: {
        elements: [],
        highlightedPseudoCodeLineIds: [10, 11],
        action: "traverse",
        message: [
          `Low link of ${getLabelById(cyInstance, u)} is equal to discovery time.`,
          "Found a strongly connected component.",
          `Pop stack into new SCC until w == ${getLabelById(cyInstance, u)}.`,
        ],
        stack: [...stack],
        dsc: new Map(disc),
        lowLink: new Map(lowLink),
      },
    });

    const scc: string[] = [];

    while (true) {
      const w = stack.pop()!;
      inStack.delete(w);
      scc.push(w);

      steps.push({
        prev: {
          elements: [
            {
              type: "node",
              id: w,
              label: getLabelById(cyInstance, w),
              classes: getClassesForNode(cyInstance, w),
            },
          ],
        },
        current: {
          elements: [
            {
              type: "node",
              id: w,
              label: getLabelById(cyInstance, w),
              classes: [`component-${allSCCs.length % COMPONENT_COLORS.length}`],
            },
          ],
          highlightedPseudoCodeLineIds: [11, 12],
          action: "traverse",
          message: [`Pop and add vertex ${getLabelById(cyInstance, w)} to current SCC.`],
          stack: [...stack],
          dsc: new Map(disc),
          lowLink: new Map(lowLink),
        },
      });

      if (w === u) break;
    }

    allSCCs.push(scc);
  }

  steps.push({
    prev: {
      elements: [],
    },
    current: {
      elements: [],
      highlightedPseudoCodeLineIds: [13],
      action: "traverse",
      message: [`End of DFS for vertex ${getLabelById(cyInstance, u)}.`],
      stack: [...stack],
      dsc: new Map(disc),
      lowLink: new Map(lowLink),
    },
  });
}

export function findSCCs({ adjacencyList, cyInstance }: FindSCCParams): SCCResult {
  const steps: StoredStep[] = [];

  const disc = new Map<string, number>();
  const lowLink = new Map<string, number>();

  for (const nodeId of adjacencyList.keys()) {
    disc.set(nodeId, -1);
    lowLink.set(nodeId, -1);
  }

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
      dsc: new Map(disc),
      lowLink: new Map(lowLink),
    },
  });

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
        message: [
          `Traverse vertex ${getLabelById(cyInstance, nodeId)}.`,
          disc.get(nodeId) === -1
            ? `Vertex ${getLabelById(cyInstance, nodeId)} is not visited.`
            : `Vertex ${getLabelById(cyInstance, nodeId)} is already visited.`,
        ],
        stack: [...stack],
        dsc: new Map(disc),
        lowLink: new Map(lowLink),
      },
    });

    if (disc.get(nodeId) === -1) {
      steps.push({
        prev: {
          elements: [],
        },
        current: {
          elements: [],
          highlightedPseudoCodeLineIds: [18],
          action: "traverse",
          message: [`Start DFS from vertex ${getLabelById(cyInstance, nodeId)}.`],
          stack: [...stack],
          dsc: new Map(disc),
          lowLink: new Map(lowLink),
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

  const resetEdgeArray =
    cyInstance?.edges().map((edge) => ({
      type: "edge",
      id: edge.id(),
      source: {
        type: "node",
        id: edge.source().id(),
        label: getLabelById(cyInstance, edge.source().id()),
      },
      target: {
        type: "node",
        id: edge.target().id(),
        label: getLabelById(cyInstance, edge.target().id()),
      },
      classes: ["-scc-visiting"],
    })) || [];

  const prevResetArray =
    cyInstance?.edges().map((edge) => ({
      type: "edge",
      id: edge.id(),
      source: {
        type: "node",
        id: edge.source().id(),
        label: getLabelById(cyInstance, edge.source().id()),
      },
      target: {
        type: "node",
        id: edge.target().id(),
        label: getLabelById(cyInstance, edge.target().id()),
      },
      classes: edge.classes(),
    })) || [];

  steps.push({
    prev: {
      elements: [...(prevResetArray as StoredStep["prev"]["elements"])],
    },
    current: {
      elements: [...(resetEdgeArray as StoredStep["current"]["elements"])],
      highlightedPseudoCodeLineIds: [19],
      action: "traverse",
      message: ["Returning all strongly connected components found."],
      stack: [...stack],
      dsc: new Map(disc),
      lowLink: new Map(lowLink),
    },
  });

  return {
    components: allSCCs,
    steps, // For simplicity, not implementing step-by-step animation for SCCs in this version
    message: `Found ${allSCCs.length} strongly connected component(s).`,
  };
}
