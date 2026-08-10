import type { GraphAlgorithm } from "@/types/algorithm-store";
import type { GraphEdge, GraphNode } from "@/types/graph-data-store";

import { GraphCanvasAdapter, type GraphCanvasCallbacks } from "@/services/graph-canvas-adapter";
import { GraphSerializer } from "@/services/graph-serializer";
import { GraphVisualizer } from "@/services/graph-visualizer";

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
  updateNodeInCy(node: Partial<GraphNode> & { id: string }): void;
  removeSelectedElements(): { nodeIds: string[]; edgeIds: string[] };
  clearCanvas(): void;
  drawGraphFromData(graphData: { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean }): void;
  getGraphSnapshot(): { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean };
  getPNG(): string;
  autoLayout(algorithm: GraphAlgorithm, animate?: boolean): void;
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

  updateNodeInCy(node: Partial<GraphNode> & { id: string }) {
    return this.canvas.updateNodeInCy(node);
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
