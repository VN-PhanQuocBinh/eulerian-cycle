import { GraphNode } from "./graph-data-store"

export type UpdateNodePayload = Partial<GraphNode> & { id: string };