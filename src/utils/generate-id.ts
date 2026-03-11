export function generateNodeId(label: string): string {
  // Tạo một ID ngẫu nhiên gồm 8 ký tự chữ và số
  // const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nodeId = `node_${label}`;
  // for (let i = 0; i < 8; i++) {
  //   nodeId += chars.charAt(Math.floor(Math.random() * chars.length));
  // }
  return nodeId;
}

export function generateEdgeId(sourceId: string, targetId: string): string {
  const edgeId = `edge-${sourceId}-${targetId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return edgeId;
}
