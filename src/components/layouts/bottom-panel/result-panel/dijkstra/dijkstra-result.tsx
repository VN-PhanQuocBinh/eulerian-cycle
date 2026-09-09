import { Step } from "@/types/algorithm-store";
import { DijkstraStepsTable } from "./dijkstra-steps-table";

export function DijkstraResult({ steps }: { steps: Step[] }) {
  if (steps.length === 0) {
    return (
      <div className="grid h-full place-items-center text-sm text-(--gl-text-muted)">
        No steps to display. Run the algorithm first.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto rounded-md bg-(--gl-bg-surface) custom-scrollbar">
      <DijkstraStepsTable steps={steps} />
    </div>
  );
}
