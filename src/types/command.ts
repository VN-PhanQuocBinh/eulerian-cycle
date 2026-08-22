import { GraphEdge, GraphNode } from './graph-data-store';
export interface Command {
  execute: () => void;
  undo: () => void;
}

export interface GraphEdgeSnapshot {
  data: GraphEdge
  style?: Record<string, any>
  classes?: string[]
}

export interface GraphNodeSnapshot {
  data: GraphNode;
  style?: Record<string, any>
  classes?: string[];
}