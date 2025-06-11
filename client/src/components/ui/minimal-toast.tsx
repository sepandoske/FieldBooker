import { useState, useEffect } from "react";

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastCounter = 0;
let listeners: Array<(toasts: ToastMessage[]) => void> = [];
let toasts: ToastMessage[] = [];

function emitChange() {
  listeners.forEach(listener => listener(toasts));
}

function addToast(toast: Omit<ToastMessage, "id">) {
  const id = ++toastCounter;
  toasts = [...toasts, { ...toast, id }];
  emitChange();
  
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id);
    emitChange();
  }, 5000);
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<ToastMessage[]>(toasts);

  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      listeners = listeners.filter(l => l !== setCurrentToasts);
    };
  }, []);

  return {
    toast: addToast,
    toasts: currentToasts
  };
}

export function ToastProvider({ children }: { children: any }) {
  const { toasts } = useToast();

  return (
    <div>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              p-4 rounded-lg shadow-lg border max-w-sm
              ${toast.variant === "destructive" 
                ? "bg-red-50 border-red-200 text-red-800" 
                : "bg-white border-gray-200 text-gray-800"
              }
            `}
          >
            <div className="font-semibold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm mt-1">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}