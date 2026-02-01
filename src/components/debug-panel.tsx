import { useGraphStore } from "@/contexts/graph-context";

export default function DebugPanel() {
  const state = useGraphStore();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-[100] max-w-xs">
      <p className="text-blue-400 mb-2 font-bold">--- DEBUG STORE ---</p>
      <p>Mode: {state.mode}</p>
      <p>Nodes: {state.nodes.length}</p>
      <p>Edges: {state.edges.length}</p>
      {/* Hiển thị JSON rút gọn nếu cần */}
      <pre className="mt-2 overflow-auto max-h-40">{JSON.stringify(state.mode, null, 2)}</pre>
    </div>
  );
}
