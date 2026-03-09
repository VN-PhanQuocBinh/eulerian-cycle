import type { GraphAlgorithm } from "@/types/graph";

export const GRAPH_EXAMPLES: Record<GraphAlgorithm, string[]> = {
  "connected-components": [
    `
      1 2
2 3
4 5
6 7
7 8
9
10
    `,
    `
      1 2
2 3
3 4
4 1
3 5
6 7
7 8
8 6
9
10
    `,
  ],

  "eulerian-cycle": [
    `
      1 2
2 3
3 4
4 5
5 6
6 1
2 5
3 6
2 3
5 6
    `,
    `
      1 2
2 3
3 1
3 4
4 5
5 3
6
7
    `
  ],
};
