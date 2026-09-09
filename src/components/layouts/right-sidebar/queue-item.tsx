import { useRef } from "react";
import { cn } from "@/utils/cn";
import { PanelHeader } from "./algorithm-state-panel";
import { ListOrdered } from "lucide-react";

function QueueItem({ values }: { values: string[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!railRef.current || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    railRef.current.scrollLeft += event.deltaY;
    event.preventDefault();
  };

  return (
    <section className="overflow-hidden rounded-md border border-(--gl-border) bg-(--gl-bg-base)">
      <PanelHeader icon={<ListOrdered size={14} />} label="Queue" count={values.length} />
      <div ref={railRef} onWheel={handleWheel} className="overflow-x-auto px-3 py-3">
        {values.length > 0 ? (
          <div className="flex min-w-max items-center gap-1.5">
            {values.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className={cn(
                  "rounded-sm border border-(--gl-border) bg-(--gl-bg-subtle) px-2.5 py-1 text-xs font-medium text-(--gl-text-main)",
                  index === 0 &&
                    "border-(--gl-green-dark) bg-(--gl-green-dark) text-(--gl-bg-surface) font-semibold",
                )}
              >
                {value}
              </span>
            ))}
          </div>
        ) : (
          <div className="py-1 text-xs italic text-(--gl-text-muted)">Empty queue</div>
        )}
      </div>
      <div className="flex justify-between px-3 pb-2 text-[10px] uppercase tracking-wide text-(--gl-text-muted)">
        <span>Front</span>
        <span>Rear</span>
      </div>
    </section>
  );
}

export default QueueItem;
