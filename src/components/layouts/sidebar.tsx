import { Play, Pause, RotateCcw, Save, FolderOpen, Settings, Zap, ChevronDown } from "lucide-react";
import { useGraphStore } from "@/contexts/graph-context";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { SelectItem, SelectContent, Select } from "@/components/ui/select";
import type { GraphAlgorithm } from "@/contexts/graph-context";

const ALGORITHM_OPTIONS: { label: string; value: GraphAlgorithm }[] = [
  { label: "Eulerian Cycle", value: "eulerian-cycle" },
  { label: "Connected Components", value: "connected-components" },
];

function Sidebar() {
  const isDirected = useGraphStore((state) => state.isDirected);
  const saveGraph = useGraphStore((state) => state.saveGraph);
  const loadGraph = useGraphStore((state) => state.loadGraph);
  const setIsDirected = useGraphStore((state) => state.setIsDirected);
  const runAlgorithm = useGraphStore((state) => state.runAlgorithm);
  const clearHighlights = useGraphStore((state) => state.clearHighlights);

  const [algorithm, setAlgorithm] = useState<"eulerian-cycle" | "eulerian-path">("eulerian-cycle");
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);

  const handleToggleRun = () => {
    runAlgorithm();
    setIsRunning(!isRunning);
  }

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col p-4 gap-4 overflow-y-auto">
      {/* GRAPH TYPE */}
      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Settings size={16} />
          Graph Type
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDirected(false)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              !isDirected
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Undirected
          </button>
          <button
            onClick={() => setIsDirected(true)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              isDirected
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Directed
          </button>
        </div>
      </section>

      {/* ALGORITHM SELECTION */}
      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Zap size={16} />
          Algorithm
        </h3>

        <Select.Root value={algorithm} onValueChange={(value) => setAlgorithm(value as any)}>
          <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 border border-slate-300 rounded-lg text-sm text-slate-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <Select.Value />
            <Select.Icon>
              <ChevronDown size={16} className="text-slate-400" />
            </Select.Icon>
          </Select.Trigger>

          <SelectContent position="popper" side="right" sideOffset={8} align="start">
            <Select.Viewport className="p-1">
              {ALGORITHM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select.Viewport>
          </SelectContent>
        </Select.Root>
      </section>

      {/* SPEED CONTROL */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-700">Speed</h3>
          <span className="text-xs text-slate-500">{speed}%</span>
        </div>
        <Slider value={[speed]} onValueChange={(value) => setSpeed(value[0])} min={10} max={100} />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </section>

      {/* ALGORITHM CONTROLS */}
      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Controls</h3>
        <div className="flex gap-2">
          <button
            onClick={handleToggleRun}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            {isRunning ? (
              <>
                <Pause size={16} />
                Pause
              </>
            ) : (
              <>
                <Play size={16} />
                Run
              </>
            )}
          </button>
          <button
            onClick={clearHighlights}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </section>

      {/* RESULT DISPLAY */}
      <section className="flex-1">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Result</h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
          <p className="text-xs text-slate-400 italic">Run the algorithm to see results...</p>
        </div>
      </section>

      {/* FILE OPERATIONS */}
      <section className="mt-auto pt-4 border-t border-slate-200">
        <div className="flex flex-col gap-2">
          <button
            onClick={loadGraph}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <FolderOpen size={16} />
            Open Graph
          </button>
          <button
            onClick={saveGraph}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            <Save size={16} />
            Save Graph
          </button>
        </div>
      </section>
    </aside>
  );
}

export default Sidebar;
