export const graphStyles: cytoscape.StylesheetJson = [
  {
    selector: "node",
    style: {
      "background-color": "#3b82f6",
      label: "data(label)",
      color: "#fff",
      "text-valign": "center",
      "text-halign": "center",
      width: 40,
      height: 40,
    },
  },
  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#94a3b8",
      "target-arrow-color": "#94a3b8",
      // "target-arrow-shape": "triangle", // Mũi tên cho đồ thị có hướng
      "curve-style": "bezier",
      "control-point-step-size": 40, // Khoảng cách uốn cong giữa các cạnh
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
];
