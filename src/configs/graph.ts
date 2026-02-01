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
];
