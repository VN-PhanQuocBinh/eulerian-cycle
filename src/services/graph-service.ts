import type { GraphAlgorithm } from "@/types/algorithm-store";
import type { GraphData, GraphEdge, GraphNode } from "@/types/graph-data-store";

import { GraphCanvasAdapter, type GraphCanvasCallbacks } from "@/services/graph-canvas-adapter";
import { GraphSerializer } from "@/services/graph-serializer";
import { GraphVisualizer } from "@/services/graph-visualizer";
import { ALGORITHM_LAYOUT_CONFIGS } from "@/configs/graph-layouts";

type Position = { x: number; y: number };

interface IGraphService {
  cy: import("cytoscape").Core | null;
  init(container: HTMLDivElement): void;
  destroy(): void;
  bindEvents(callbacks: {
    onNodeAdd: (params: { renderedPosition: Position; position: Position }) => void;
    onNodeUpdate: (params: { id: string; position: Position }) => void;
    onEdgeAdd: (edge: GraphEdge) => void;
  }): void;
  toggleDrawMode(enable: boolean): void;
  addNodeToCy(node: GraphNode): void;
  addEdgeToCy(edge: GraphEdge): void;
  updateNodeInCy(node: Partial<GraphNode> & { id: string }): void;
  removeElementById(elementId: string): void;
  removeSelectedElements(): { nodeIds: string[]; edgeIds: string[] };
  clearCanvas(): void;
  drawGraphFromData(graphData: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    isDirected: boolean;
  }): void;
  getGraphSnapshot(): { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean };
  getPNG(): string;
  autoLayout(algorithm: GraphAlgorithm, animate?: boolean): void;
  calculateLayoutHeadless(graphData: GraphData, algorithm: GraphAlgorithm): Promise<GraphData>;
  highlightElement(elementId: string, className: string[], pulse?: boolean): void;
  applyLabelsToEdges(labels: Map<string, string>): void;
  clearLabelsFromEdges(params: { edgeIds?: string[]; all?: boolean }): void;
  toggleDirected(isDirected: boolean): void;
  applyStylesFromMap(styles: Map<string, Set<string>>): void;
  zoomGraph(type: "in" | "out"): void;
  resetGraph(): void;
}

class GraphService implements IGraphService {
  private readonly canvas = new GraphCanvasAdapter();
  private readonly visualizer = new GraphVisualizer(this.canvas);
  private readonly serializer = new GraphSerializer(this.canvas);

  get cy() {
    return this.canvas.cy;
  }

  init(container: HTMLDivElement) {
    return this.canvas.init(container);
  }

  destroy() {
    this.canvas.destroy();
  }

  bindEvents(callbacks: GraphCanvasCallbacks) {
    return this.canvas.bindEvents(callbacks);
  }

  toggleDrawMode(enable: boolean) {
    return this.canvas.toggleDrawMode(enable);
  }

  addNodeToCy(node: GraphNode) {
    return this.canvas.addNodeToCy(node);
  }

  addEdgeToCy(edge: GraphEdge) {
    return this.canvas.addEdgeToCy(edge);
  }

  updateNodeInCy(node: Partial<GraphNode> & { id: string }) {
    return this.canvas.updateNodeInCy(node);
  }

  removeElementById(elementId: string) {
    return this.canvas.removeElementById(elementId);
  }

  removeSelectedElements() {
    return this.canvas.removeSelectedElements();
  }

  clearCanvas() {
    return this.canvas.clearCanvas();
  }

  drawGraphFromData(graphData: { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean }) {
    return this.canvas.drawGraphFromData(graphData);
  }

  getGraphSnapshot() {
    return this.serializer.getGraphSnapshot();
  }

  getPNG() {
    return this.serializer.getPNG();
  }

  autoLayout(algorithm: GraphAlgorithm, animate = true) {
    return this.visualizer.autoLayout(algorithm, animate);
  }

  // NOT USED IN THE CURRENT IMPLEMENTATION, BUT KEPT FOR FUTURE USE
  async calculateLayoutHeadless(
    graphData: GraphData,
    algorithm: GraphAlgorithm,
  ): Promise<GraphData> {
    return new Promise((resolve) => {
      if (!this.canvas.cy) {
        throw new Error("Cytoscape instance is not initialized.");
      }

      const headlessCy = this.canvas.createHeadlessCyInstance(graphData);

      console.log(headlessCy.width(), headlessCy.height());

      headlessCy.resize();

      const layout = headlessCy.layout({
        ...ALGORITHM_LAYOUT_CONFIGS[algorithm],
        animate: false,
        fit: false,
      } as cytoscape.LayoutOptions);

      layout.one("layoutstop", () => {
        const updatedNodes: GraphNode[] = headlessCy.nodes().map((node) => ({
          id: node.id(),
          label: node.data("label"),
          x: node.position().x,
          y: node.position().y,
        }));

        const updatedEdges: GraphEdge[] = headlessCy.edges().map((edge) => ({
          id: edge.id(),
          source: edge.data("source"),
          target: edge.data("target"),
          label: edge.data("label"),
        }));

        headlessCy.destroy();
        resolve({
          nodes: updatedNodes,
          edges: updatedEdges,
          isDirected: graphData.isDirected,
        });
      });

      layout.run();
    });
  }

  highlightElement(elementId: string, className: string[], pulse = false) {
    return this.visualizer.highlightElement(elementId, className, pulse);
  }

  applyLabelsToEdges(labels: Map<string, string>) {
    return this.visualizer.applyLabelsToEdges(labels);
  }

  clearLabelsFromEdges(params: { edgeIds?: string[]; all?: boolean }) {
    return this.visualizer.clearLabelsFromEdges(params);
  }

  toggleDirected(isDirected: boolean) {
    return this.visualizer.toggleDirected(isDirected);
  }

  applyStylesFromMap(styles: Map<string, Set<string>>) {
    return this.visualizer.applyStylesFromMap(styles);
  }

  zoomGraph(type: "in" | "out") {
    return this.visualizer.zoomGraph(type);
  }

  resetGraph() {
    return this.visualizer.resetGraph();
  }
}

export const graphService = new GraphService();
