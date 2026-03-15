import { COMPONENT_COLORS } from "@/types/styles";
import { getLabelById } from "@/utils";
import { GraphData, GraphNode, GraphEdge } from "@/types/graph-data-store";
import { Step, AlgorithmStore, StepNodeElement } from "@/types/algorithm-store";
import { createGraphUtils } from "@/core/helpers/graph-utils";

interface SCCResult {
  components: string[][];
  steps: Step[];
  message: string;
}

interface FindSCCParams {
  data: GraphData;
}

interface RunSCCParams {
  steps: Step[];
  u: StepNodeElement;
  disc: Map<string, number>;
  lowLink: Map<string, number>;
  stack: string[];
  inStack: Set<string>;
  timer: { value: number };
  allSCCs: string[][];
}

// Tarjan's algorithm implementation for finding strongly connected components

export class TarjanSCC {
  private utils: ReturnType<typeof createGraphUtils>;
  readonly nodes: GraphNode[] = [];
  readonly edges: GraphEdge[] = [];
  readonly isDirected: boolean = true;
  readonly adjacencyList: Map<string, string[]> = new Map();

  steps: Step[] = [];
  disc: Map<string, number> = new Map();
  lowLink: Map<string, number> = new Map();
  stack: string[] = [];
  inStack: Set<string> = new Set();
  timer = { value: 0 };
  allSCCs: string[][] = [];

  constructor(data: GraphData) {
    this.utils = createGraphUtils(data);
    this.nodes = data.nodes;
    this.edges = data.edges;
    this.isDirected = data.isDirected;
    this.adjacencyList = this.utils.adjacencyList;
  }

  traverse(u: string) {
    const nodeElement = this.utils.getNode(u)!;

    this.timer.value++;
    this.disc.set(nodeElement.id, this.timer.value);
    this.lowLink.set(nodeElement.id, this.timer.value);

    this.stack.push(nodeElement.id);
    this.inStack.add(nodeElement.id);

    this.steps.push({
      elements: [
        {
          type: "node",
          id: nodeElement.id,
          label: nodeElement.label,
          classes: ["scc-in-stack"],
        },
      ],
      highlightedPseudoCodeLineIds: [1, 2, 3, 4],
      message: [
        `Set discovery time and low link for vertex ${nodeElement.label} to ${this.timer.value}.`,
        `Push ${nodeElement.label} onto stack and mark as inStack.`,
        `For each neighbor v of ${nodeElement.label}.`,
      ],
      stack: [...this.stack],
      dsc: new Map(this.disc),
      lowLink: new Map(this.lowLink),
    });

    const neighborIds = this.adjacencyList.get(u) || [];

    for (const neighborId of neighborIds) {
      const neighborElement = this.utils.getNode(neighborId)!;
      const processingEdge = this.utils.getEdges(u, neighborId);

      if (this.disc.get(neighborId) === -1) {
        this.steps.push({
          elements: [
            {
              type: "edge",
              id: processingEdge[0].id,
              source: {
                type: "node",
                id: u,
                label: nodeElement.label,
              },
              target: {
                type: "node",
                id: neighborId,
                label: neighborElement.label,
              },
              classes: ["scc-visiting"],
            },
          ],
          highlightedPseudoCodeLineIds: [5, 6],
          message: [
            `Neighbor ${neighborElement.label} is not visited. Recursively DFS on ${neighborElement.label}.`,
          ],
          stack: [...this.stack],
          dsc: new Map(this.disc),
          lowLink: new Map(this.lowLink),
        });

        this.traverse(neighborId);

        const currentLowLink = this.lowLink.get(u);
        const neighborLowLink = this.lowLink.get(neighborId);

        this.lowLink.set(u, Math.min(currentLowLink!, neighborLowLink!));

        this.steps.push({
          elements: [],
          highlightedPseudoCodeLineIds: [7],
          message: [`Update low link for vertex ${nodeElement.label}.`],
          stack: [...this.stack],
          dsc: new Map(this.disc),
          lowLink: new Map(this.lowLink),
        });
      } else if (this.inStack.has(neighborId)) {
        const currentLowLink = this.lowLink.get(u);
        const neighborDisc = this.disc.get(neighborId);

        this.lowLink.set(u, Math.min(currentLowLink!, neighborDisc!));

        this.steps.push({
          elements: [
            {
              type: "edge",
              id: processingEdge[0].id,
              source: {
                type: "node",
                id: u,
                label: nodeElement.label,
              },
              target: {
                type: "node",
                id: neighborId,
                label: neighborElement.label,
              },
              classes: ["scc-visiting"],
            },
          ],
          highlightedPseudoCodeLineIds: [8, 9],
          message: [
            `Neighbor ${neighborElement.label} is in stack.`,
            `Update low link for vertex ${nodeElement.label}.`,
          ],
          stack: [...this.stack],
          dsc: new Map(this.disc),
          lowLink: new Map(this.lowLink),
        });
      }
    }

    if (this.lowLink.get(u) === this.disc.get(u)) {
      this.steps.push({
        elements: [],
        highlightedPseudoCodeLineIds: [10, 11],
        message: [
          `Low link of ${nodeElement.label} is equal to discovery time.`,
          "Found a strongly connected component.",
          `Pop stack into new SCC until w == ${nodeElement.label}.`,
        ],
        stack: [...this.stack],
        dsc: new Map(this.disc),
        lowLink: new Map(this.lowLink),
      });

      const scc: string[] = [];

      while (true) {
        const w = this.stack.pop()!;
        const wElement = this.utils.getNode(w)!;
        this.inStack.delete(w);
        scc.push(w);

        this.steps.push({
          elements: [
            {
              type: "node",
              id: w,
              label: wElement.label,
              classes: [`component-${this.allSCCs.length % COMPONENT_COLORS.length}`],
            },
          ],
          highlightedPseudoCodeLineIds: [11, 12],
          message: [`Pop and add vertex ${wElement.label} to current SCC.`],
          stack: [...this.stack],
          dsc: new Map(this.disc),
          lowLink: new Map(this.lowLink),
        });

        if (w === u) break;
      }

      this.allSCCs.push(scc);
    }

    this.steps.push({
      elements: [],
      highlightedPseudoCodeLineIds: [13],
      message: [`End of DFS for vertex ${this.utils.getNode(u)?.label}.`],
      stack: [...this.stack],
      dsc: new Map(this.disc),
      lowLink: new Map(this.lowLink),
    });
  }

  execute(): SCCResult {
    for (const nodeId of this.adjacencyList.keys()) {
      this.disc.set(nodeId, -1);
      this.lowLink.set(nodeId, -1);
    }

    this.steps.push({
      elements: [],
      highlightedPseudoCodeLineIds: [14, 15],
      message: ["Initialize discovery time and low link maps, stack, and timer."],
      stack: [],
      dsc: new Map(this.disc),
      lowLink: new Map(this.lowLink),
    });

    const allSCCs: string[][] = [];

    for (const nodeId of this.adjacencyList.keys()) {
      const nodeElement = this.utils.getNode(nodeId)!;

      this.steps.push({
        elements: [],
        highlightedPseudoCodeLineIds: [16, 17],
        message: [
          `Traverse vertex ${nodeElement.label}.`,
          this.disc.get(nodeId) === -1
            ? `Vertex ${nodeElement.label} is not visited.`
            : `Vertex ${nodeElement.label} is already visited.`,
        ],
        stack: [...this.stack],
        dsc: new Map(this.disc),
        lowLink: new Map(this.lowLink),
      });

      if (this.disc.get(nodeId) === -1) {
        this.steps.push({
          elements: [],
          highlightedPseudoCodeLineIds: [18],
          message: [`Start DFS from vertex ${nodeElement.label}.`],
          stack: [...this.stack],
          dsc: new Map(this.disc),
          lowLink: new Map(this.lowLink),
        });

        this.traverse(nodeId);
      }
    }

    const resetEdgeArray =
      this.edges.map((edge) => ({
        type: "edge",
        id: edge.id,
        source: {
          type: "node",
          id: edge.source,
          label: this.utils.getNode(edge.source)!.label,
        },
        target: {
          type: "node",
          id: edge.target,
          label: this.utils.getNode(edge.target)!.label,
        },
        classes: ["-scc-visiting"],
      })) || [];

    this.steps.push({
      elements: [...(resetEdgeArray as Step["elements"])],
      highlightedPseudoCodeLineIds: [19],
      message: ["Returning all strongly connected components found."],
      stack: [...this.stack],
      dsc: new Map(this.disc),
      lowLink: new Map(this.lowLink),
    });

    return {
      components: allSCCs,
      steps: this.steps, // For simplicity, not implementing step-by-step animation for SCCs in this version
      message: `Found ${allSCCs.length} strongly connected component(s).`,
    };
  }
}
