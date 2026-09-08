import { cn } from "@/utils/cn";
import * as Select from "@radix-ui/react-select";
import { Check } from "lucide-react";
import { forwardRef } from "react";

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className="relative flex items-center px-8 py-2 text-sm text-(--gl-text-main) cursor-pointer select-none hover:bg-(--gl-text-main) hover:text-(--gl-text-main) outline-none data-highlighted:bg-(--gl-bg-subtle) data-highlighted:text-(--gl-text-main) transition-colors"
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemIndicator className="absolute left-2 inline-flex items-center text-(--gl-blue-dark)">
          <Check size={16} />
        </Select.ItemIndicator>
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  },
);

SelectItem.displayName = "SelectItem";

const SelectContent = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Content>
>(({ children, className = "", ...props }, forwardedRef) => {
  return (
    <Select.Portal>
      <Select.Content
        {...props}
        ref={forwardedRef}
        className={cn(
          "bg-(--gl-bg-surface) border border-(--gl-border) rounded-lg shadow-lg overflow-hidden z-50 animate-select-in",
          className,
        )}
      >
        {children}
      </Select.Content>
    </Select.Portal>
  );
});

SelectContent.displayName = "SelectContent";

export { Select, SelectItem, SelectContent };
