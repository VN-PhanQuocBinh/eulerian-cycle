import { PseudoCodeLine } from "@/types/pseudo-code";

const BLANK_LINE: PseudoCodeLine = { id: 0, text: "", indent: 0 };

export const HIERHOLZER_PSEUDOCODE: PseudoCodeLine[] = [
  { id: 1, text: "procedure FindEulerianCycle(Graph, start)", indent: 0 },
  { id: 2, text: "create a copy G of Graph", indent: 1 },
  { id: 3, text: "create empty stack S", indent: 1 },
  { id: 4, text: "create empty list Circuit", indent: 1 },
  { id: 5, text: "push start onto S", indent: 1 },
  { id: 6, text: "while S is not empty", indent: 1 },
  { id: 7, text: "u = top element of S", indent: 2 },
  { id: 8, text: "if G[u] has unused edges", indent: 2 },
  { id: 9, text: "select and remove an unused edge (u, v) from G[u]", indent: 3 },
  { id: 10, text: "remove edge (v, u) from G[v]", indent: 3 },
  { id: 11, text: "push v onto S", indent: 3 },
  { id: 12, text: "else", indent: 2 },
  { id: 13, text: "pop u from S", indent: 3 },
  { id: 14, text: "add u to Circuit", indent: 3 },
  { id: 15, text: "reverse Circuit", indent: 1 },
  { id: 16, text: "return Circuit", indent: 1 },
];

export const CONNECTED_COMPONENTS_PSEUDOCODE: PseudoCodeLine[] = [
  // BFS procedure
  { id: 1, text: "procedure BFS(Graph, start)", indent: 0 },
  { id: 2, text: "create empty queue Q", indent: 1 },
  { id: 3, text: "mark start as visited and enqueue it", indent: 1 },
  { id: 4, text: "while Q is not empty", indent: 1 },
  { id: 5, text: "u = dequeue from Q", indent: 2 },
  { id: 6, text: "add u to current component", indent: 2 },
  { id: 7, text: "for each neighbor v of u", indent: 2 },
  { id: 8, text: "if v is not visited", indent: 3 },
  { id: 9, text: "mark v as visited", indent: 4 },
  { id: 10, text: "enqueue v to Q", indent: 4 },
  { id: 11, text: "end procedure", indent: 0 },

  BLANK_LINE, // Blank line

  // Main procedure
  { id: 12, text: "procedure FindConnectedComponents(Graph)", indent: 0 },
  { id: 13, text: "Initialize visited set and components list.", indent: 1 },
  { id: 14, text: "for each vertex v in Graph", indent: 1 },
  { id: 15, text: "if v is not in visited", indent: 2 },
  { id: 16, text: "BFS(Graph, v)", indent: 3 },
  { id: 17, text: "add Component to Components", indent: 3 },
  { id: 18, text: "return Components", indent: 1 },
];

export const TARJAN_SCC_PSEUDOCODE: PseudoCodeLine[] = [
  // DFS procedure
  { id: 1, text: "procedure DFS(u)", indent: 0 },
  { id: 2, text: "disc[u] = lowLink[u] = ++timer", indent: 1 },
  { id: 3, text: "push u onto stack and mark u as inStack", indent: 1 },
  { id: 4, text: "for each neighbor v of u", indent: 1 },
  { id: 5, text: "if v is not visited", indent: 2 },
  { id: 6, text: "DFS(v)", indent: 3 },
  { id: 7, text: "lowLink[u] = min(lowLink[u], lowLink[v])", indent: 3 },
  { id: 8, text: "else if v is in stack", indent: 2 },
  { id: 9, text: "lowLink[u] = min(lowLink[u], disc[v])", indent: 3 },
  { id: 10, text: "if lowLink[u] == disc[u]  // u is SCC root", indent: 1 },
  { id: 11, text: "pop stack into new SCC until w == u", indent: 2 },
  { id: 12, text: "add SCC to allSCCs", indent: 2 },
  { id: 13, text: "end procedure", indent: 0 },

  BLANK_LINE, // Blank line

  // Main procedure
  { id: 14, text: "procedure FindSCCs(Graph)", indent: 0 },
  { id: 15, text: "initialize disc, lowLink, stack, inStack, allSCCs", indent: 1 },
  { id: 16, text: "for each vertex u in Graph", indent: 1 },
  { id: 17, text: "if u is not visited", indent: 2 },
  { id: 18, text: "DFS(u)", indent: 3 },
  { id: 19, text: "return allSCCs", indent: 1 },
];

export const DFS_PSEUDOCODE: PseudoCodeLine[] = [
  { id: 1, text: "procedure DFS(Graph, startNodeId, targetNodeId):", indent: 0 },
  { id: 2, text: "create empty set Visited", indent: 1 },
  { id: 3, text: "create empty stack S", indent: 1 },
  { id: 4, text: "create empty map ParentMap", indent: 1 },

  BLANK_LINE, // Blank line

  { id: 5, text: "push startNodeId onto S", indent: 1 },
  { id: 6, text: "initialize ParentMap[startNodeId] = null", indent: 1 },

  BLANK_LINE, // Blank line

  { id: 7, text: "while S is not empty:", indent: 1 },
  { id: 8, text: "currentNode = pop from S", indent: 2 },
  { id: 9, text: "if currentNode is in Visited: continue", indent: 2 },
  { id: 10, text: "add currentNode to Visited", indent: 2 },

  BLANK_LINE, // Blank line

  { id: 11, text: "if currentNode == targetNodeId:", indent: 2 },
  { id: 12, text: "reconstruct path using ParentMap and break", indent: 3 },

  BLANK_LINE, // Blank line

  { id: 13, text: "for each neighbor v of currentNode:", indent: 2 },
  { id: 14, text: "if v is not in Visited:", indent: 3 },
  { id: 15, text: "set ParentMap[v] = currentNode", indent: 4 },
  { id: 16, text: "push v onto S", indent: 4 },

  BLANK_LINE, // Blank line

  { id: 17, text: "return path and found status", indent: 1 },
];
