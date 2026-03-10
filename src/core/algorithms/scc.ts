import { GraphNode, StoredStep, GraphState } from "@/types/graph";

interface SCCResult {
  components: string[][];
  steps: StoredStep[];
  message: string;
}

interface FindSCCParams {
  adjacencyList: ReturnType<GraphState["getAdjacencyList"]>;
}

interface RunSCCParams {
  u: string;
  adjacencyList: Map<string, GraphNode[]>;
  disc: Map<string, number>;
  lowLink: Map<string, number>;
  stack: string[];
  inStack: Set<string>;
  timer: { value: number };
  allSCCs: string[][];
}

// Tarjan's algorithm implementation for finding strongly connected components
function runSCC(
  u: RunSCCParams["u"],
  adjacencyList: RunSCCParams["adjacencyList"],
  disc: RunSCCParams["disc"],
  lowLink: RunSCCParams["lowLink"],
  stack: RunSCCParams["stack"],
  inStack: RunSCCParams["inStack"],
  timer: RunSCCParams["timer"],
  allSCCs: RunSCCParams["allSCCs"],
) {
  timer.value++;
  disc.set(u, timer.value);
  lowLink.set(u, timer.value);

  stack.push(u);
  inStack.add(u);

  const neighbors = adjacencyList.get(u) || [];

  for (const neighbor of neighbors) {
    if (!disc.has(neighbor.id)) {
      runSCC(neighbor.id, adjacencyList, disc, lowLink, stack, inStack, timer, allSCCs);

      const currentLowLink = lowLink.get(u);
      const neighborLowLink = lowLink.get(neighbor.id);

      lowLink.set(u, Math.min(currentLowLink!, neighborLowLink!));
    } else if (inStack.has(neighbor.id)) {
      const currentLowLink = lowLink.get(u);
      const neighborDisc = disc.get(neighbor.id);

      lowLink.set(u, Math.min(currentLowLink!, neighborDisc!));
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
  }
}

export function findSCCs({ adjacencyList }: FindSCCParams): SCCResult {
  const disc = new Map<string, number>();
  const lowLink = new Map<string, number>();

  const stack: string[] = [];
  const inStack = new Set<string>();
  const timer = { value: 0 };

  const allSCCs: string[][] = [];

  for (const nodeId of adjacencyList.keys()) {
    if (!disc.has(nodeId)) {
      runSCC(nodeId, adjacencyList, disc, lowLink, stack, inStack, timer, allSCCs);
    }
  }

  return {
    components: allSCCs,
    steps: [], // For simplicity, not implementing step-by-step animation for SCCs in this version
    message: `Found ${allSCCs.length} strongly connected component(s).`,
  };
}
