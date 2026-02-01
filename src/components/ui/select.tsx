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
        className="relative flex items-center px-8 py-2 text-sm text-slate-700 cursor-pointer select-none hover:bg-blue-50 hover:text-blue-600 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-600 transition-colors"
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
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
          "bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50 animate-select-in ",
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
