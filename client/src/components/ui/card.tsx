import React from "react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement("div", { 
    className: `rounded-lg border bg-white p-6 shadow-sm ${className}`, 
    ...props 
  }, children);
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement("div", { 
    className: `flex flex-col space-y-1.5 p-6 ${className}`, 
    ...props 
  }, children);
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return React.createElement("h3", { 
    className: `text-2xl font-semibold leading-none tracking-tight ${className}`, 
    ...props 
  }, children);
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return React.createElement("p", { 
    className: `text-sm text-gray-600 ${className}`, 
    ...props 
  }, children);
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return React.createElement("div", { 
    className: `p-6 pt-0 ${className}`, 
    ...props 
  }, children);
}