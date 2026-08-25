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
    name: "dagre",
    rankDir: "TB", 
    animate: true,
    animationDuration: 600,
    nodeSep: 50, 
    rankSep: 80,
    padding: 80,
    fit: true,
  } as cytoscape.LayoutOptions,

  bfs: {
    name: "dagre",
    rankDir: "LR", 
    animate: true,
    animationDuration: 600,
    nodeSep: 60,
    rankSep: 100, 
    padding: 80,
    fit: true,
  } as cytoscape.LayoutOptions,
};
