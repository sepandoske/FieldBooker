import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-600 text-white",
    outline: "border border-gray-300 text-gray-900"
  };
  
  return React.createElement("div", {
    className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className}`,
    ...props
  }, children);
}