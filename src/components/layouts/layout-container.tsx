import { cn } from "@/utils/cn";

function LayoutContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-full p-1 bg-(--gl-bg-base)", className)}>{children}</div>
  );
}

export default LayoutContainer;
