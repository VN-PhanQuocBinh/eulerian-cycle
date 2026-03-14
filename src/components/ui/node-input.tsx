import { createContext, useState, useEffect, useRef, useContext, forwardRef } from "react";

type HandleComplete = (label: string) => void;

interface NodeInputContextType {
  openNodeInputAt: (params: { x: number; y: number; onComplete: HandleComplete }) => void;
}

const NodeInputContext = createContext<NodeInputContextType | null>(null);

interface NodeInputProps {
  ref?: React.Ref<HTMLDivElement>;
  zoomLevel?: number;
  position?: { x: number; y: number };
  onBlur?: HandleComplete;
}

export const NodeInput = forwardRef<HTMLDivElement, NodeInputProps>(
  ({ zoomLevel = 1, position, onBlur }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Focus vào contentEditable khi component mount
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.focus();
      }
    }, []);

    useEffect(() => {
      const handleKeyDown = (event: MouseEvent) => {
        if (internalRef.current && internalRef.current.contains(event.target as Node)) return;
        onBlur?.(internalRef.current?.innerText || "");
      };

      const handleEnterKey = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onBlur?.(internalRef.current?.innerText || "");
        }
      };

      // Add event listeners for mouse down and key down events
      window.addEventListener("mousedown", handleKeyDown);
      window.addEventListener("keydown", handleEnterKey);

      return () => {
        window.removeEventListener("mousedown", handleKeyDown);
        window.removeEventListener("keydown", handleEnterKey);
      };
    }, [ref]);

    return (
      <div
        ref={internalRef}
        className="absolute bg-[#3b82f6] text-white rounded-full size-10 flex justify-center"
        style={{
          scale: zoomLevel,
          top: position?.y,
          left: position?.x,
        }}
      >
        <div
          contentEditable
          className="bg-white rounded-full drop-shadow-lg drop-shadow-black outline-none text-gray-800 w-max max-w-20 min-w-10 inline-flex items-center justify-center px-1"
          ref={ref}
        />
      </div>
    );
  },
);

export function NodeInputProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const inputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef<HandleComplete>();

  const openNodeInputAt = ({
    x,
    y,
    onComplete,
  }: {
    x: number;
    y: number;
    onComplete: HandleComplete;
  }) => {
    setPosition({ x, y });
    setIsOpen(true);
    onCompleteRef.current = onComplete;
  };

  const handleComplete = () => {
    const content = inputRef.current?.innerText.trim();

    setIsOpen(false);
    if (onCompleteRef.current) {
      onCompleteRef.current(content!);
    }
  };

  return (
    <NodeInputContext.Provider value={{ openNodeInputAt }}>
      <div ref={containerRef} className="relative node-input-provider h-full w-full">
        {children}
        {isOpen && (
          <NodeInput ref={inputRef} onBlur={handleComplete} zoomLevel={1} position={position} />
        )}
      </div>
    </NodeInputContext.Provider>
  );
}

export function useNodeInput() {
  const context = useContext(NodeInputContext);
  if (!context) {
    throw new Error("useNodeInput must be used within a NodeInputProvider");
  }
  return context;
}
