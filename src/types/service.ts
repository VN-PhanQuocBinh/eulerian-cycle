import { GraphEdge, GraphNode } from "./graph-data-store"

export type UpdateNodePayload = Partial<GraphNode> & { id: string };
export type UpdateEdgePayload = Partial<GraphEdge> & { id: string };