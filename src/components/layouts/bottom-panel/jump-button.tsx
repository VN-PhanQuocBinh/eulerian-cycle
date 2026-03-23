import { Target } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { useStepControl } from "@/hooks/use-step-control";

interface Props {
  index: number;
}

function JumpButton({ index }: Props) {
  const jumpTo = useStepControl().jumpTo;

  return (
    <div className="min-h-16 min-w-10 grid place-items-center">
      <Tooltip content={`Jump to step ${index + 1}`} side="right">
        <button
          onClick={() => jumpTo(index)}
          className="text-foreground p-1 rounded hidden group-hover:block"
        >
          <Target size={24} />
        </button>
      </Tooltip>
      <span className="group-hover:hidden">{index + 1}</span>
    </div>
  );
}

export default JumpButton;
