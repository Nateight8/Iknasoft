"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Added import for JSX

interface ResizableHeaderProps {
  children?: React.ReactNode
  width: number
  onResize: (width: number) => void
  minWidth?: number
  maxWidth?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
  columnId?: string
  columnLabel?: string
  onSort?: () => void
  sortDirection?: 'asc' | 'desc' | undefined
  onAction?: (action: string, columnId: string, value?: string) => void
  key?: string | number
}

export function ResizableHeader({
  children,
  width,
  onResize,
  minWidth = 80,
  maxWidth = 400,
  className,
  as: Component = "th",
  columnLabel,
  onSort,
  sortDirection,
}: ResizableHeaderProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      setStartX(e.clientX)
      setStartWidth(width)

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX
        const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff))
        onResize(newWidth)
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [width, startX, startWidth, minWidth, maxWidth, onResize],
  )

  return (
    <Component 
      className={cn("relative group", className)} 
      style={{ width }}
      onClick={onSort}
    >
      <div className="flex items-center justify-between p-2">
        <span>{columnLabel || children}</span>
        {sortDirection && (
          <span className="ml-2">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize",
          "hover:bg-primary/50 group-hover:bg-primary/30",
          isResizing && "bg-primary",
        )}
        onMouseDown={handleMouseDown}
      />
    </Component>
  )
}
