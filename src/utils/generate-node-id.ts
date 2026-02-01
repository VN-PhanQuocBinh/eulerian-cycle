export function generateNodeId(): string {
  // Tạo một ID ngẫu nhiên gồm 8 ký tự chữ và số
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nodeId = "node-";
  for (let i = 0; i < 8; i++) {
    nodeId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nodeId;
}
