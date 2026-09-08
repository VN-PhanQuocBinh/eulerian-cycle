import { cn } from "@/utils/cn";

function LayoutContainer({ children }: { children: React.ReactNode }) {
  return <div className={cn("h-full p-1 bg-(--gl-bg-base)")}>{children}</div>;
}

export default LayoutContainer;
