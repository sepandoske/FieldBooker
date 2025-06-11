import React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export function Alert({ className = "", variant = "default", children, ...props }: AlertProps) {
  const variantClasses = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800"
  };
  
  return React.createElement("div", {
    className: `relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`,
    ...props
  }, children);
}

export function AlertDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return React.createElement("div", {
    className: `text-sm ${className}`,
    ...props
  }, children);
}