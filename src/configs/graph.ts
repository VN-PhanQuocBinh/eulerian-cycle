import { COMPONENT_COLORS } from "@/types/styles";
import { GraphAlgorithm } from "@/types/algorithm-store";

const BASE_GRAPH_COLORS = {
  nodeBackground: "#FFFFFF",
  nodeBorder: "#607D8B",
  label: "#263238",
  highlightedLabel: "#FFFFFF",
  edge: "#607D8B",
  selected: "#ECEFF1",
  highlightedBackground: "#FFEBEE",
  highlightedBorder: "#E53935",
} as const;

export const ALGORITHM_GRAPH_COLORS: Record<GraphAlgorithm, Record<string, string>> = {
  "eulerian-cycle": {
    exploring: "#FFA000",
    inCycle: "#43A047",
  },
  "connected-components": {
    visiting: "#FFA000",
    inStack: "#039BE5",
    processingNeighbor: "#607D8B",
  },
  dfs: {
    processingNeighbor: "#607D8B",
    visitingNeighbor: "#039BE5",
    inPath: "#43A047",
  },
  bfs: {
    processingNeighbor: "#607D8B",
    visitingNeighbor: "#039BE5",
    inPath: "#43A047",
  },
  dijkstra: {
    considering: "#FFA000",
    relaxed: "#43A047",
    visited: "#039BE5",
    shortestPath: "#FFA000",
  },
} satisfies Record<GraphAlgorithm, Record<string, string>>;

export const NODE_STYLES: cytoscape.Css.Node = {
  "background-color": BASE_GRAPH_COLORS.nodeBackground,
  "border-width": "2px",
  "border-color": BASE_GRAPH_COLORS.nodeBorder,
  label: (ele: cytoscape.NodeSingular) => {
    const data = ele.data();
    return data.label !== undefined ? String(data.label) : "";
  },
  color: BASE_GRAPH_COLORS.label,
  "font-size": "14px",
  "text-valign": "center",
  "text-halign": "center",
  width: 35,
  height: 35,
};

export const EDGE_STYLES: cytoscape.Css.Edge = {
  width: 3,
  "line-color": BASE_GRAPH_COLORS.edge,
  "target-arrow-color": BASE_GRAPH_COLORS.edge,
  "curve-style": "bezier",
  "font-weight": "bold",
  "control-point-step-size": 40,
  label: (ele: cytoscape.EdgeSingular) => {
    const data = ele.data();
    return data.label !== undefined ? String(data.label) : "";
  },
  // "text-rotation": "autorotate",
  "text-margin-y": -10,
  color: BASE_GRAPH_COLORS.label,
  "font-size": "12px",
};

const priorityStyles: cytoscape.StylesheetJson = [
  {
    selector: "node:selected",
    style: {
      "background-color": BASE_GRAPH_COLORS.selected,
    },
  },
  {
    selector: "edge:selected",
    style: {
      "line-color": BASE_GRAPH_COLORS.selected,
      width: 5,
    },
  },
];

export const graphStyles: cytoscape.StylesheetJson = [
  {
    selector: "node",
    style: NODE_STYLES,
  },
  {
    selector: "node.default",
    style: NODE_STYLES,
  },
  {
    selector: "edge",
    style: EDGE_STYLES,
  },
  {
    selector: "edge[?isDirected]",
    style: {
      "target-arrow-shape": "triangle",
    },
  },
  {
    selector: "edge[?isWeighted]",
    style: {
      label: (ele: cytoscape.EdgeSingular) => {
        const data = ele.data();
        let finalLabel = data.label !== undefined ? String(data.label) : "";
        if (data.weight !== undefined) {
          finalLabel += ` (${data.weight})`;
        }
        return finalLabel;
      },
    },
  },
  {
    selector: "edge[source = target]", // Chọn các edge tự nối
    style: {
      "curve-style": "bezier",
      "control-point-step-size": 40, // Khoảng cách khuyên vươn ra ngoài
      "loop-direction": "-45deg", // Hướng vòng khuyên
      "loop-sweep": "80deg", // Độ mở của vòng khuyên
    },
  },

  // ========== STYLE FOR HIGHLIGHTED ELEMENTS ==========
  {
    selector: "node.highlighted",
    style: {
      "background-color": BASE_GRAPH_COLORS.highlightedBackground,
      "border-width": "4px",
      "border-color": BASE_GRAPH_COLORS.highlightedBorder,
      "z-index": 999,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.3,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "edge.highlighted",
    style: {
      width: 4,
      "z-index": 999,
    },
  },
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.2,
    },
  },

  {
    selector: "node.exploring",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].exploring,
      "border-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].exploring,
      "border-width": "4px",
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "node.in-cycle",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].inCycle,
      "border-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].inCycle,
      "border-width": "4px",
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "edge.exploring",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].exploring,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].exploring,
      width: 4,
    } as cytoscape.Css.Edge,
  },
  {
    selector: "edge.in-cycle",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].inCycle,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS["eulerian-cycle"].inCycle,
      width: 4,
    } as cytoscape.Css.Edge,
  },

  // ========== STYLES FOR SCC ANIMATION ==========
  {
    selector: "node.scc-visiting",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS["connected-components"].visiting,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "node.scc-in-stack",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS["connected-components"].inStack,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "edge.scc-visiting",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS["connected-components"].visiting,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS["connected-components"].visiting,
    },
  },

  // ========= STYLES FOR DFS, BFS ANIMATION ==========
  {
    selector: "node.processing-neighbor",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS.dfs.processingNeighbor,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "node.visiting-neighbor",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS.dfs.visitingNeighbor,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "edge.processing-neighbor",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS.dfs.processingNeighbor,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS.dfs.processingNeighbor,
    },
  },
  {
    selector: "edge.visiting-neighbor",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS.dfs.visitingNeighbor,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS.dfs.visitingNeighbor,
    },
  },
  {
    selector: "node.in-path",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS.dfs.inPath,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "edge.in-path",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS.dfs.inPath,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS.dfs.inPath,
    },
  },

  // ========= STYLES FOR DIJKSTRA ANIMATION ==========
  {
    selector: "node.considering",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS.dijkstra.considering,
      "border-color": ALGORITHM_GRAPH_COLORS.dijkstra.considering,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "node.relaxed",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS.dijkstra.relaxed,
      "border-color": ALGORITHM_GRAPH_COLORS.dijkstra.relaxed,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "node.visited",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS.dijkstra.visited,
      "border-color": ALGORITHM_GRAPH_COLORS.dijkstra.visited,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "edge.considering",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS.dijkstra.considering,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS.dijkstra.considering,
    },
  },
  {
    selector: "edge.relaxed",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS.dijkstra.relaxed,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS.dijkstra.relaxed,
    },
  },
  {
    selector: "edge.visited",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS.dijkstra.visited,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS.dijkstra.visited,
    },
  },
  {
    selector: "node.in-shortest-path",
    style: {
      "background-color": ALGORITHM_GRAPH_COLORS.dijkstra.shortestPath,
      "border-color": ALGORITHM_GRAPH_COLORS.dijkstra.shortestPath,
      color: BASE_GRAPH_COLORS.highlightedLabel,
    },
  },
  {
    selector: "edge.in-shortest-path",
    style: {
      "line-color": ALGORITHM_GRAPH_COLORS.dijkstra.shortestPath,
      "target-arrow-color": ALGORITHM_GRAPH_COLORS.dijkstra.shortestPath,
    },
  },

  ...COMPONENT_COLORS.map(({ bg, border, text }, index) => ({
    selector: `node.component-${index}`,
    style: {
      "background-color": bg,
      "border-color": border,
      color: text,
    },
  })),

  ...COMPONENT_COLORS.map(({ bg }, index) => ({
    selector: `edge.component-${index}`,
    style: {
      "line-color": bg,
      "target-arrow-color": bg,
      width: 4,
    } as cytoscape.Css.Edge,
  })),

  ...priorityStyles,
];
