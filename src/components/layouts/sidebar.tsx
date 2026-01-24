import { MousePointer2, PlusCircle, Play, Save } from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-[250px] bg-white border-r border-slate-200 flex flex-col p-4 gap-6">
      <nav className="flex flex-col gap-2"></nav>

      <div className="mt-auto flex flex-col gap-2">
        <button className="flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg bg-slate-50 transition-all text-slate-600">
          <Save size={16} /> Lưu File
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
