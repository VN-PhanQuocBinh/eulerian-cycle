import { COMPONENT_COLORS } from "@/types/styles";

export const NODE_STYLES: cytoscape.Css.Node = {
  "background-color": "#1e2227", // Tiệp màu nền nhưng tối hơn một chút
  "border-width": "2px",
  "border-color": "#abb2bf", // Viền xám sáng
  label: "data(label)",
  color: "#ffffff", // Chữ trắng tinh để nổi bật
  "font-size": "14px",
  "text-valign": "center",
  "text-halign": "center",
  width: 35,
  height: 35,
};

export const EDGE_STYLES: cytoscape.Css.Edge = {
  width: 3,
  "line-color": "#b6bdca", // edge mặc định sáng hơn rõ rệt trên nền tối
  "target-arrow-color": "#b6bdca",
  "curve-style": "bezier",
  "control-point-step-size": 40,
  label: "data(label)",
  color: "#ffffff",
  "font-size": "12px",
};

const priorityStyles: cytoscape.StylesheetJson = [
  {
    selector: "node:selected",
    style: {
      "background-color": "#5c6370",
    },
  },
  {
    selector: "edge:selected",
    style: {
      "line-color": "#5c6370",
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
      "background-color": "#3e4451",
      "border-width": "4px",
      "border-color": "#e06c75",
      "z-index": 999,
    },
  },
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.3,
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
      "background-color": "#e5c07b",
      "border-color": "#e5c07b",
      "border-width": "4px",
    },
  },
  {
    selector: "node.in-cycle",
    style: {
      "background-color": "#98c379",
      "border-color": "#98c379",
      "border-width": "4px",
    },
  },
  {
    selector: "edge.exploring",
    style: {
      "line-color": "#e5c07b",
      "target-arrow-color": "#e5c07b",
      width: 4,
    } as cytoscape.Css.Edge,
  },
  {
    selector: "edge.in-cycle",
    style: {
      "line-color": "#98c379",
      "target-arrow-color": "#98c379",
      width: 4,
    } as cytoscape.Css.Edge,
  },

  // ========== STYLES FOR SCC ANIMATION ==========
  {
    selector: "node.scc-visiting",
    style: {
      "background-color": "#e5c07b",
    },
  },
  {
    selector: "node.scc-in-stack",
    style: {
      "background-color": "#c678dd",
    },
  },
  {
    selector: "edge.scc-visiting",
    style: {
      "line-color": "#c678dd",
      "target-arrow-color": "#c678dd",
    },
  },

  // ========= STYLES FOR DFS, BFS ANIMATION ==========
  {
    selector: "node.processing-neighbor",
    style: {
      "background-color": "#616161",
    },
  },
  {
    selector: "node.visiting-neighbor",
    style: {
      "background-color": "#61afef",
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
