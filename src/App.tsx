import GraphCanvas from "./components/graph-canvas";
import Sidebar from "./components/layouts/sidebar";
import { NodeInputProvider } from "./components/ui/node-input";

function App() {
  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden text-slate-900">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 h-full">
        <NodeInputProvider>
          <GraphCanvas />
        </NodeInputProvider>
      </main>
    </div>
  );
}

export default App;
