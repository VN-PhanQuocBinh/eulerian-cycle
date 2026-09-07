import cytoscape from "cytoscape";

import { ALGORITHM_LAYOUT_CONFIGS } from "@/configs/graph-layouts";
import type { GraphAlgorithm } from "@/types/algorithm-store";
import type { GraphCanvasAdapter } from "@/services/graph-canvas-adapter";

export class GraphVisualizer {
  constructor(private readonly canvas: GraphCanvasAdapter) {}

  autoLayout(algorithm: GraphAlgorithm, animate = true) {
    const cy = this.canvas.cy;
    if (!cy || !algorithm) return;

    const layoutConfig = ALGORITHM_LAYOUT_CONFIGS[algorithm];
    if (layoutConfig) {
      cy.layout({ ...layoutConfig, animate } as cytoscape.LayoutOptions).run();
    }
  }

  resetGraph() {
    this.canvas.resetGraph();
  }

  highlightElement(elementId: string, className: string[], pulse = false) {
    this.canvas.highlightElement(elementId, className, pulse);
  }

  applyLabelsToEdges(labels: Map<string, string>) {
    this.canvas.applyLabelsToEdges(labels);
  }

  clearLabelsFromEdges(params: { edgeIds?: string[]; all?: boolean }) {
    this.canvas.clearLabelsFromEdges(params);
  }

  applyWeightsToEdges(weights: Map<string, string>) {
    this.canvas.applyWeightsToEdges(weights);
  }

  clearWeightsFromEdges(params: { edgeIds?: string[]; all?: boolean }) {
    this.canvas.clearWeightsFromEdges(params);
  }

  toggleDirected(isDirected: boolean) {
    this.canvas.toggleDirected(isDirected);
  }

  toggleWeighted(isWeighted: boolean) {
    this.canvas.toggleWeighted(isWeighted);
  }

  applyStylesFromMap(styles: Map<string, Set<string>>) {
    this.canvas.applyStylesFromMap(styles);
  }

  zoomGraph(type: "in" | "out") {
    this.canvas.zoomGraph(type);
  }
}
