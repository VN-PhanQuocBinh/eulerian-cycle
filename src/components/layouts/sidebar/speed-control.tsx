import { cn } from "@/utils/cn";
import { Slider } from "@/components/ui/slider";

interface SpeedControlProps {
  speed: number;
  disabled: boolean;
  setSpeed: (speed: number) => void;
}

function SpeedControl({ speed, disabled, setSpeed }: SpeedControlProps) {
  return (
    <section>
      <div className={cn("flex items-center justify-between mb-2", disabled ? "opacity-50" : "")}>
        <h3 className="text-base font-semibold text-(--gl-text-main)">Speed</h3>
        <span className="text-xs text-(--gl-text-muted)">{speed}x</span>
      </div>
      <Slider
        disabled={disabled}
        value={[speed]}
        onValueChange={(value) => setSpeed(value[0])}
        min={0.5}
        max={3}
        step={0.25}
      />
      <div className="flex justify-between text-xs text-(--gl-text-muted) mt-1">
        <span>Slow</span>
        <span>Fast</span>
      </div>
    </section>
  );
}

export default SpeedControl;
