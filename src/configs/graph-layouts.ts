import { GraphAlgorithm } from "@/types/algorithm-store";
import cytoscape from "cytoscape";

export const ALGORITHM_LAYOUT_CONFIGS: Record<GraphAlgorithm, cytoscape.LayoutOptions> = {
  "connected-components": {
    name: "cose", // Force-directed layout: Tốt nhất để thấy các cụm tách rời
    animate: true,
    animationDuration: 800,
    refresh: 20,
    fit: true,
    padding: 100,
    nodeRepulsion: () => 8000, // Đẩy các cụm xa nhau ra
    idealEdgeLength: () => 50,
    edgeElasticity: () => 100,
    nodeOverlap: 10,
    componentSpacing: 100, // Khoảng cách giữa các thành phần liên thông
  },

  "eulerian-cycle": {
    name: "dagre", // Layered layout: Hiển thị luồng đi cực tốt
    rankDir: "TB", // Trái sang Phải: Phù hợp để đọc tiến trình
    nodeSep: 60, // Khoảng cách giữa các node
    edgeSep: 100, // Khoảng cách giữa các cạnh (tránh đè đa cạnh)
    rankSep: 10, // Khoảng cách giữa các tầng
    animate: true,
    animationDuration: 600,
    padding: 100,
    fit: true,
  } as cytoscape.LayoutOptions,

  dfs: {
    name: "cose",
    animate: true,
    animationDuration: 600,
    fit: true,
    padding: 80,
    randomize: false,
    nodeRepulsion: () => 100000, // Đẩy các node xa nhau ra
    idealEdgeLength: () => 30, // Độ dài mong muốn của cạnh
    edgeElasticity: () => 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 1000,
    coolingFactor: 0.99,
    minTemp: 1.0,
  } as cytoscape.LayoutOptions,

  bfs: {
    name: "cose",
    animate: true,
    animationDuration: 600,
    fit: true,
    padding: 80,
    randomize: false,
    nodeRepulsion: () => 100000, // Đẩy các node xa nhau ra
    idealEdgeLength: () => 30, // Độ dài mong muốn của cạnh
    edgeElasticity: () => 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 1000,
    coolingFactor: 0.99,
    minTemp: 1.0,
  } as cytoscape.LayoutOptions,

  dijkstra: {
    name: "cose",
    animate: true,
    animationDuration: 600,
    fit: true,
    padding: 80,
    randomize: false,
    nodeRepulsion: () => 200000, // Đẩy các node xa nhau hơn để lộ rõ label weight trên edge
    idealEdgeLength: () => 100, // Tăng độ dài cạnh giúp con số trọng số không bị che lấp
    edgeElasticity: () => 100,
    gravity: 60, // Giảm lực hút về tâm để đồ thị giãn rộng rãi
    numIter: 1000,
  } as cytoscape.LayoutOptions,
};
