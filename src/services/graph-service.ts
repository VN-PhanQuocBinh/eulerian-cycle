import type { GraphAlgorithm } from "@/types/algorithm-store";
import type { GraphData, GraphEdge, GraphNode } from "@/types/graph-data-store";

import { GraphCanvasAdapter, type GraphCanvasCallbacks } from "@/services/graph-canvas-adapter";
import { GraphSerializer } from "@/services/graph-serializer";
import { GraphVisualizer } from "@/services/graph-visualizer";
import { ALGORITHM_LAYOUT_CONFIGS } from "@/configs/graph-layouts";
import { GraphEdgeSnapshot, GraphNodeSnapshot } from "@/types/command";
import { UpdateNodePayload, UpdateEdgePayload } from "@/types/service";

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
  addNodeToCy(node: GraphNodeSnapshot): void;
  addNodesToCy(nodes: GraphNodeSnapshot[]): void;
  addEdgeToCy(edge: GraphEdgeSnapshot): void;
  addEdgeToCy(edge: GraphEdgeSnapshot): void;
  updateNodeInCy(node: UpdateNodePayload): void;
  updateNodesInCy(nodes: UpdateNodePayload[]): void;
  updateEdgeInCy(edge: UpdateEdgePayload): void;
  updateEdgesInCy(edges: UpdateEdgePayload[]): void;
  removeElementById(elementId: string): void;
  removeElementsByIds(elementIds: string[]): void;
  getSelectedElements(): { nodes: GraphNodeSnapshot[]; edges: GraphEdgeSnapshot[] };
  removeSelectedElements(): { nodeIds: string[]; edgeIds: string[] };
  clearCanvas(): void;
  drawGraphFromData(graphData: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    isDirected: boolean;
  }): void;
  getClassesByElementId(elementId: string): string[];
  getNodeSnapshotById(nodeId: string): GraphNodeSnapshot | null;
  getEdgeSnapshotById(edgeId: string): GraphEdgeSnapshot | null;
  getGraphSnapshot(): { nodes: GraphNode[]; edges: GraphEdge[]; isDirected: boolean };
  getPNG(): string;
  autoLayout(algorithm: GraphAlgorithm, animate?: boolean): void;
  calculateLayoutHeadless(graphData: GraphData, algorithm: GraphAlgorithm): Promise<GraphData>;
  highlightElement(elementId: string, className: string[], pulse?: boolean): void;
  applyLabelsToEdges(labels: Map<string, string>): void;
  clearLabelsFromEdges(params: { edgeIds?: string[]; all?: boolean }): void;
  applyWeightsToEdges(weights: Map<string, string>): void;
  clearWeightsFromEdges(params: { edgeIds?: string[]; all?: boolean }): void;
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

  addNodeToCy(node: GraphNodeSnapshot) {
    return this.canvas.addNodesToCy([node]);
  }

  addNodesToCy(nodes: GraphNodeSnapshot[]) {
    return this.canvas.addNodesToCy(nodes);
  }

  addEdgeToCy(edge: GraphEdgeSnapshot) {
    return this.canvas.addEdgesToCy([edge]);
  }

  addEdgesToCy(edges: GraphEdgeSnapshot[]) {
    return this.canvas.addEdgesToCy(edges);
  }

  updateNodeInCy(node: UpdateNodePayload) {
    return this.canvas.updateNodesInCy([node]);
  }

  updateNodesInCy(nodes: UpdateNodePayload[]) {
    return this.canvas.updateNodesInCy(nodes);
  }

  updateEdgeInCy(edge: UpdateEdgePayload) {
    return this.canvas.updateEdgesInCy([edge]);
  }

  updateEdgesInCy(edges: UpdateEdgePayload[]) {
    return this.canvas.updateEdgesInCy(edges);
  }

  removeElementById(elementId: string) {
    return this.canvas.removeElementById(elementId);
  }

  removeElementsByIds(elementIds: string[]) {
    return this.canvas.removeElementsByIds(elementIds);
  }

  getSelectedElements() {
    return this.canvas.getSelectedElements();
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

  getClassesByElementId(elementId: string) {
    return this.canvas.getClassesByElementId(elementId);
  }

  getNodeSnapshotById(nodeId: string) {
    return this.serializer.getNodeSnapshotById(nodeId);
  }

  getEdgeSnapshotById(edgeId: string) {
    return this.serializer.getEdgeSnapshotById(edgeId);
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
          weight: edge.data("weight"),
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

  applyWeightsToEdges(weights: Map<string, string>) {
    return this.visualizer.applyWeightsToEdges(weights);
  }

  clearWeightsFromEdges(params: { edgeIds?: string[]; all?: boolean }) {
    return this.visualizer.clearWeightsFromEdges(params);
  }

  toggleDirected(isDirected: boolean) {
    return this.visualizer.toggleDirected(isDirected);
  }

  toggleWeighted(isWeighted: boolean) {
    return this.visualizer.toggleWeighted(isWeighted);
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
