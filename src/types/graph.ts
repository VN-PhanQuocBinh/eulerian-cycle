export interface NodeData {
  id: string;
  label?: string;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
}

export interface GraphElement {
  data: NodeData | EdgeData;
  position?: { x: number; y: number };
}
