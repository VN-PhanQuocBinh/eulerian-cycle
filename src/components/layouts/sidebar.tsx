import { Save } from "lucide-react";
import { useGraphStore } from "@/contexts/graph-context";

function Sidebar() {
  const saveGraph = useGraphStore((state) => state.saveGraph);
  const loadGraph = useGraphStore((state) => state.loadGraph);

  return (
    <aside className="w-[250px] bg-white border-r border-slate-200 flex flex-col p-4 gap-6">
      <nav className="flex flex-col gap-2"></nav>

      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={loadGraph}
          className="flex items-center bg-blue-700 hover:bg-blue-800 transition-colors text-white justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg"
        >
          <Save size={16} className="" /> Open File
        </button>
        <button
          onClick={saveGraph}
          className="flex items-center bg-blue-700 hover:bg-blue-800 transition-colors text-white justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg"
        >
          <Save size={16} className="" /> Save File
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
