"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface SortableHeaderProps {
  children: React.ReactNode
  column: string
  currentSort?: { column: string; direction: "asc" | "desc" }[]
  onSort: (column: string) => void
  className?: string
}

export function SortableHeader({ children, column, currentSort = [], onSort, className }: SortableHeaderProps) {
  const sortState = currentSort.find((s) => s.column === column)
  const sortIndex = currentSort.findIndex((s) => s.column === column)

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 px-2 justify-start font-medium text-muted-foreground hover:text-foreground ${className}`}
      onClick={() => onSort(column)}
    >
      <span className="truncate">{children}</span>
      <div className="ml-1 flex items-center">
        {sortState ? (
          <div className="flex items-center gap-1">
            {sortIndex >= 0 && currentSort.length > 1 && (
              <span className="text-xs bg-muted rounded px-1">{sortIndex + 1}</span>
            )}
            {sortState.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          </div>
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        )}
      </div>
    </Button>
  )
}
