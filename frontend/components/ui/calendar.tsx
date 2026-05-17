"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
};

function Calendar({ className, selected, onSelect, ...props }: CalendarProps) {
  return (
    <div className={cn("rounded-md border border-border bg-card p-3", className)} {...props}>
      <input
        type="date"
        value={selected ? selected.toISOString().slice(0, 10) : ""}
        onChange={(event) =>
          onSelect?.(event.target.value ? new Date(event.target.value) : undefined)
        }
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
