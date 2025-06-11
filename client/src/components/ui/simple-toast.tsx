import * as React from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return React.createElement(
    ToastContext.Provider,
    { value: { toasts, toast, dismiss } },
    children,
    React.createElement(ToastContainer)
  );
}

function ToastContainer() {
  const context = React.useContext(ToastContext);
  if (!context) return null;

  const { toasts, dismiss } = context;

  return React.createElement(
    "div",
    { className: "fixed top-0 right-0 z-50 w-full max-w-sm p-4 space-y-4 pointer-events-none" },
    toasts.map((toast) =>
      React.createElement(
        "div",
        {
          key: toast.id,
          className: `pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all ${
            toast.variant === "destructive"
              ? "border-red-500 bg-red-50 text-red-900"
              : "border-gray-200 bg-white text-gray-900"
          }`,
        },
        React.createElement(
          "div",
          { className: "grid gap-1" },
          toast.title &&
            React.createElement("div", { className: "text-sm font-semibold" }, toast.title),
          toast.description &&
            React.createElement("div", { className: "text-sm opacity-90" }, toast.description)
        ),
        React.createElement(
          "button",
          {
            onClick: () => dismiss(toast.id),
            className: "absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:text-gray-900 focus:outline-none",
          },
          React.createElement(X, { className: "h-4 w-4" })
        )
      )
    )
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}