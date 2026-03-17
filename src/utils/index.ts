import { generateNodeId, generateEdgeId } from "@/utils/generate-id";
import type { GraphNode, GraphEdge, GraphState } from "@/types/graph";

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const generateEdgeSelector = (sourceId: string, targetId: string) => {
  return `edge[source = "${sourceId}"][target = "${targetId}"], edge[source = "${targetId}"][target = "${sourceId}"]`;
};

export function graphToEdgeList(nodes: GraphNode[], edges: GraphEdge[]): string {
  const nodeMap = new Map(nodes.map((n) => [n.id, n.label]));
  const hasNeighborlessNodes = new Set();

  const edgeTexts = edges
    .map((e) => {
      const sourceLabel = nodeMap.get(e.source) ?? e.source;
      const targetLabel = nodeMap.get(e.target) ?? e.target;
      hasNeighborlessNodes.add(e.source);
      hasNeighborlessNodes.add(e.target);

      return `${sourceLabel} ${targetLabel}`;
    })
    .join("\n");

  const nodeTexts = nodes
    .filter((n) => !hasNeighborlessNodes.has(n.id))
    .map((n) => nodeMap.get(n.id) ?? n.id)
    .join("\n");
  return [edgeTexts, nodeTexts].filter(Boolean).join("\n");
}

export function parseEdgeList(text: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const labelToId = new Map<string, string>();
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const getOrCreateNode = (label: string): string => {
    if (!labelToId.has(label)) {
      const id = generateNodeId(label);
      labelToId.set(label, id);
      nodes.push({ id, label, x: 0, y: 0 });
    }
    return labelToId.get(label)!;
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    // Support both "A B" and "A -> B"
    const tokens = line.split(/\s+/).filter((t) => t !== "->");
    if (tokens.length < 1) continue;

    if (tokens.length === 1) {
      getOrCreateNode(tokens[0]);
      continue;
    }

    const [srcLabel, tgtLabel] = tokens;
    const sourceId = getOrCreateNode(srcLabel);
    const targetId = getOrCreateNode(tgtLabel);
    const edgeId = generateEdgeId(sourceId, targetId);

    if (!edges.find((e) => e.id === edgeId)) {
      edges.push({ id: edgeId, source: sourceId, target: targetId });
    }
  }

  return { nodes, edges };
}

export const arrayToString = (arr: string[]) => {
  let result: string = arr.join(", ");
  return "[" + result + "]";
};
