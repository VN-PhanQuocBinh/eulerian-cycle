import { COMPONENT_COLORS } from "@/types/styles";

export const NODE_STYLES: cytoscape.Css.Node = {
  "background-color": "#3b82f6",
  label: "data(label)",
  color: "#fff",
  "text-valign": "center",
  "text-halign": "center",
  width: 40,
  height: 40,
};

export const EDGE_STYLES: cytoscape.Css.Edge = {
  width: 3,
  "line-color": "#94a3b8",
  "target-arrow-color": "#94a3b8",
  // "target-arrow-shape": "triangle", // Mũi tên cho đồ thị có hướng
  "curve-style": "bezier",
  "control-point-step-size": 40, // Khoảng cách uốn cong giữa các cạnh
};

export const graphStyles: cytoscape.StylesheetJson = [
  {
    selector: "node",
    style: NODE_STYLES,
  },
  {
    selector: "edge",
    style: EDGE_STYLES,
  },
  {
    selector: "edge.directed",
    style: {
      "target-arrow-shape": "triangle",
    },
  },
  {
    selector: "node:selected",
    style: {
      "background-color": "#f0c002", // Viền đỏ khi chọn
      color: "#000",
    },
  },
  {
    selector: "edge:selected",
    style: {
      "line-color": "#f0c002",
      width: 5,
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
      "background-color": "#ccc",
      "border-width": "4px",
      "border-color": "#ff5722",
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

  ...COMPONENT_COLORS.map((color, index) => ({
    selector: `node.component-${index}`,
    style: {
      "background-color": color,
    },
  })),

  ...COMPONENT_COLORS.map((color, index) => ({
    selector: `edge.component-${index}`,
    style: {
      "line-color": color,
      "target-arrow-color": color,
      width: 4,
    } as cytoscape.Css.Edge,
  })),

  {
    selector: "node.exploring",
    style: {
      "background-color": "#f59e0b",
      "border-color": "#f59e0b",
      "border-width": "4px",
    },
  },
  {
    selector: "node.in-cycle",
    style: {
      "background-color": "#10b981",
      "border-color": "#10b981",
      "border-width": "4px",
    },
  },
  {
    selector: "edge.in-cycle",
    style: {
      "line-color": "#10b981",
      "target-arrow-color": "#10b981",
      width: 4,
    } as cytoscape.Css.Edge,
  },

  {
    selector: "node.scc-visiting",
    style: {
      "background-color": "#f59e0b", // vàng cam - đang active
      "border-color": "#f59e0b",
      "border-width": "4px",
    },
  },
  {
    selector: "node.scc-in-stack",
    style: {
      "background-color": "#6366f1", // tím nhạt - đang trên stack
      "border-color": "#6366f1",
      "border-width": "3px",
    },
  },
  {
    selector: "node.scc-root",
    style: {
      "background-color": "#ef4444", // đỏ - là root của SCC
      "border-color": "#ef4444",
      "border-width": "4px",
    },
  },
  {
    selector: "edge.scc-tree-edge",
    style: {
      "line-color": "#f59e0b",
      "target-arrow-color": "#f59e0b",
      width: 4,
    } as cytoscape.Css.Edge,
  },
  {
    selector: "edge.scc-back-edge",
    style: {
      "line-color": "#ef4444",
      "target-arrow-color": "#ef4444",
      width: 4,
    } as cytoscape.Css.Edge,
  },

  // ========== STYLES FOR SCC ANIMATION ==========
  {
    selector: "node.scc-visiting",
    style: {
      "background-color": "#f59e0b", // vàng cam - đang active
      "border-color": "#f59e0b",
      "border-width": "4px",
    },
  },
  {
    selector: "node.scc-in-stack",
    style: {
      "background-color": "#6366f1", // tím nhạt - đang trên stack
      "border-color": "#6366f1",
      "border-width": "3px",
    },
  },
];
