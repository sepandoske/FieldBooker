import React from "react";

export function Table({ className = "", ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return React.createElement("div", { className: "relative w-full overflow-auto" },
    React.createElement("table", {
      className: `w-full caption-bottom text-sm ${className}`,
      ...props
    })
  );
}

export function TableHeader({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return React.createElement("thead", {
    className: `[&_tr]:border-b ${className}`,
    ...props
  });
}

export function TableBody({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return React.createElement("tbody", {
    className: `[&_tr:last-child]:border-0 ${className}`,
    ...props
  });
}

export function TableRow({ className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return React.createElement("tr", {
    className: `border-b transition-colors hover:bg-gray-50 ${className}`,
    ...props
  });
}

export function TableHead({ className = "", ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return React.createElement("th", {
    className: `h-12 px-4 text-right align-middle font-medium text-gray-600 ${className}`,
    ...props
  });
}

export function TableCell({ className = "", ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return React.createElement("td", {
    className: `p-4 align-middle ${className}`,
    ...props
  });
}