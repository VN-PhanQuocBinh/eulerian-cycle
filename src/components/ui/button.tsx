import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#61AFEF]/60 focus-visible:ring-offset-1 focus-visible:ring-offset-[#21252B] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#61AFEF] text-[#1F2430] shadow-sm hover:bg-[#74B9F1] active:bg-[#529FDB]",
        destructive: "bg-[#E06C75] text-[#1F2430] shadow-sm hover:bg-[#EB7B83] active:bg-[#CF5F69]",
        outline:
          "border-[#4B5263] bg-[#282C34] text-[#ABB2BF] shadow-sm hover:bg-[#2C313C] hover:text-[#D7DAE0]",
        secondary: "bg-[#3B4048] text-[#ABB2BF] shadow-sm hover:bg-[#454B55] hover:text-[#D7DAE0]",
        ghost: "text-[#ABB2BF] hover:bg-[#2C313C] hover:text-[#D7DAE0]",
        link: "text-[#61AFEF] underline-offset-4 hover:text-[#7ABAF2] hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
