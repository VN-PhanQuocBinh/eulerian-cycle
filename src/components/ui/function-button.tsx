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
            "flex items-center justify-center p-3 rounded-lg text-sm",
            "border border-(--od-border) bg-(--od-bg-2) text-(--od-fg-1)",
            "hover:bg-(--od-bg-3) transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--od-blue)",
            "disabled:pointer-events-none disabled:opacity-50",
            { "bg-(--od-blue)! border-(--od-blue)! text-(--primary-foreground)": active },
            props.className,
          )}
        >
          <Icon size={18} />
        </button>
      </Tooltip>
    );
  },
);

FunctionButton.displayName = "FunctionButton";

export default FunctionButton;
