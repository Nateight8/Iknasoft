"use client"

import type React from "react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { SortAsc, SortDesc, Filter, EyeOff, ArrowLeft, ArrowRight, Settings, Pin, PinOff } from "lucide-react"

interface ColumnContextMenuProps {
  children: React.ReactNode
  columnId: string
  columnLabel: string
  canSort?: boolean
  canHide?: boolean
  canPin?: boolean
  isPinned?: boolean
  onAction: (action: string, columnId: string, value?: string) => void
}

export function ColumnContextMenu({
  children,
  columnId,
  columnLabel,
  canSort = true,
  canHide = true,
  canPin = false,
  isPinned = false,
  onAction,
}: ColumnContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {canSort && (
          <>
            <ContextMenuItem onClick={() => onAction("sort", columnId, "asc")}>
              <SortAsc className="mr-2 h-4 w-4" />
              Sort Ascending
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("sort", columnId, "desc")}>
              <SortDesc className="mr-2 h-4 w-4" />
              Sort Descending
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem onClick={() => onAction("filter", columnId)}>
          <Filter className="mr-2 h-4 w-4" />
          Filter by {columnLabel}
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Settings className="mr-2 h-4 w-4" />
            Column Actions
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => onAction("resize", columnId, "auto")}>Auto-size Column</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("resize", columnId, "fit")}>Fit to Content</ContextMenuItem>
            {canPin && (
              <ContextMenuItem onClick={() => onAction("pin", columnId)}>
                {isPinned ? (
                  <>
                    <PinOff className="mr-2 h-4 w-4" />
                    Unpin Column
                  </>
                ) : (
                  <>
                    <Pin className="mr-2 h-4 w-4" />
                    Pin Column
                  </>
                )}
              </ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Move Column
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => onAction("move", columnId, "left")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Move Left
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("move", columnId, "right")}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Move Right
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {canHide && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onAction("hide", columnId)}>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide Column
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
