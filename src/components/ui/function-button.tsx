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
            "flex items-center justify-center p-2 rounded-md text-sm",
            "border border-(--gl-border) text-(--gl-text-main)",
            "hover:bg-(--gl-bg-subtle) transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--gl-blue-dark)",
            "disabled:pointer-events-none disabled:opacity-50",
            { "bg-(--gl-blue-dark)! border-(--gl-blue-dark)! text-(--primary-foreground)": active },
            props.className,
          )}
        >
          <Icon size={16} />
        </button>
      </Tooltip>
    );
  },
);

FunctionButton.displayName = "FunctionButton";

export default FunctionButton;
