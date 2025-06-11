import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return React.createElement("div", {
    className: `animate-pulse rounded-md bg-gray-200 ${className}`,
    ...props
  });
}