import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}

export type ToastHandler = ({
  message,
  type,
  duration,
}: {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}) => void;

interface ToastContextType {
  showToast: ToastHandler;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    ({ message, type = "info", duration = 3000 }: Parameters<ToastHandler>[0]) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    [],
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto px-4 py-3 rounded-lg shadow-lg
              flex items-center gap-3 min-w-[300px] max-w-[500px]
              animate-toast-in
              ${toast.type === "success" ? "bg-(--od-green) text-white" : ""}
              ${toast.type === "error" ? "bg-(--od-red) text-white" : ""}
              ${toast.type === "warning" ? "bg-(--od-yellow) text-white" : ""}
              ${toast.type === "info" ? "bg-(--od-blue) text-white" : ""}
            `}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
