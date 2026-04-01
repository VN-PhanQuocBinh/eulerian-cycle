import type { GraphAlgorithm } from "@/types/graph";

export const GRAPH_EXAMPLES: Record<"directed" | "undirected", Record<GraphAlgorithm, string[]>> = {
  directed: {
    "eulerian-cycle": [
      `
    1 2
2 3
3 1
1 4
4 5
5 1
2 6
6 7
7 2
3 8
8 9
9 3
    `,
    ],

    "connected-components": [
      `
    1 2
2 3
3 1
3 4
4 5
5 6
6 4
6 7
7 8
8 9
9 7
8 10
10 11
11 12
12 10
11 13
13 14
14 13
14 15
15 16
16 15
5 8
9 4
12 6
    `,
      `
    1 2
2 3
3 1
3 4
4 5
5 4
5 6
    `,
      `
    1 2
2 3
3 4
4 5
5 1
3 6
6 7
7 8
8 6
8 4
7 9
9 10
10 9
    `,
    ],
  },
  undirected: {
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
      `
    1 2
2 3
3 4
4 5
5 1
3 6
6 7
8 9
9 10
10 8
11
12`,
      `
    1 2
1 3
2 4
2 5
3 6
6 7
7 8
8 3
5 9
9 10
11 12
12 13
13 11
14
15`,
      `
      A B
B C
D E
F
G
      `,
      `
      p q
q r
r s
t u
v
w x
      `
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
    `,
      `
    1 2
2 3
3 4
4 1
2 5
5 6
6 3
3 7
7 8
8 3
5 7
6 8
2 3
5 6
7 8
9
10
    `,
    ],
  },
};
