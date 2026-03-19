import { ChevronDown, Gauge } from "lucide-react";
import { cn } from "@/utils/cn";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";

interface SpeedControlProps {
  className?: string;
  speed: number;
  disabled: boolean;
  setSpeed: (speed: number) => void;
}

const STEP = 0.25;
const MIN_SPEED = 0.5;
const MAX_SPEED = 3;
const SPEED_VALUES = Array.from(
  { length: Math.floor((MAX_SPEED - MIN_SPEED) / STEP) + 1 },
  (_, i) => +(MIN_SPEED + i * STEP).toFixed(2),
);

function SpeedControl({ className, speed, disabled, setSpeed }: SpeedControlProps) {
  const isValidSpeed = SPEED_VALUES.includes(speed as (typeof SPEED_VALUES)[number]);
  const normalizedValue = isValidSpeed ? String(speed) : "1";

  return (
    <Select.Root value={normalizedValue} onValueChange={(value) => setSpeed(Number(value))}>
      <Select.Trigger
        className={cn(
          "h-[42px] min-w-[92px] px-3 rounded-lg border border-slate-200 bg-white text-slate-700",
          "flex items-center justify-between gap-2 text-sm font-medium transition-all",
          "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        disabled={disabled}
        aria-label="Animation speed"
      >
        <span className="inline-flex items-center gap-2">
          <Gauge size={16} />
          <Select.Value placeholder="1x" />
        </span>

        <Select.Icon>
          <ChevronDown size={14} className="text-slate-400" />
        </Select.Icon>
      </Select.Trigger>

      <SelectContent position="popper" side="top" sideOffset={8} align="center">
        <Select.Viewport className="p-1">
          {SPEED_VALUES.map((value) => (
            <SelectItem key={String(value)} value={String(value)}>
              {value}x
            </SelectItem>
          ))}
        </Select.Viewport>
      </SelectContent>
    </Select.Root>
  );
}

export default SpeedControl;
