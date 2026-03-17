import { LucideIcon } from "lucide-react";
import { Tooltip } from "./tooltip";

import { cn } from "@/utils/cn";

interface FunctionButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<React.ComponentProps<typeof Tooltip>, "content" | "children"> {
  tooltipContent?: string;
  icon: LucideIcon;
  active?: boolean;
}

function FunctionButton({ tooltipContent, active, icon: Icon, ...props }: FunctionButtonProps) {
  return (
    <Tooltip content={tooltipContent} side={props.side || "top"}>
      <button
        {...props}
        className={cn(
          "flex justify-center items-center bg-white p-3 rounded-lg shadow border text-sm hover:bg-slate-50 transition-all disabled:pointer-events-none disabled:opacity-50",
          { "bg-blue-600! text-white": active },
          props.className,
        )}
      >
        <Icon size={18} />
      </button>
    </Tooltip>
  );
}

export default FunctionButton;
