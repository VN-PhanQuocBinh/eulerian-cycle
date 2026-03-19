import { LucideIcon } from "lucide-react";
import { Tooltip } from "./tooltip";
import React, { forwardRef } from "react";

import { cn } from "@/utils/cn";

interface FunctionButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<React.ComponentProps<typeof Tooltip>, "content" | "children"> {
  tooltipContent?: string;
  icon: LucideIcon;
  active?: boolean;
}

const FunctionButton = forwardRef<HTMLButtonElement, FunctionButtonProps>(
  ({ tooltipContent, active, icon: Icon, ...props }, ref) => {
    return (
      <Tooltip content={tooltipContent} side={props.side || "top"}>
        <button
          ref={ref}
          {...props}
          className={cn(
            "flex justify-center items-center p-3 rounded-lg text-sm hover:bg-slate-50 transition-all disabled:pointer-events-none disabled:opacity-50",
            { "bg-blue-600! text-white": active },
            props.className,
          )}
        >
          <Icon size={18} />
        </button>
      </Tooltip>
    );
  },
);

export default FunctionButton;
