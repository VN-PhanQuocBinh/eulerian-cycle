import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={`
      z-50 overflow-hidden rounded-lg bg-(--dark-color-2) px-3 py-1.5 
      text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 
      data-[state=closed]:animate-out data-[state=closed]:fade-out-0 
      data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 
      data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 
      data-[side=top]:slide-in-from-bottom-2
      ${className || ""}
    `}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Simple Tooltip Component
interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
  asChild?: boolean;
}

const Tooltip = ({
  children,
  content,
  side = "bottom",
  delayDuration = 200,
  asChild = true,
}: TooltipProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export { Tooltip, TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider };
