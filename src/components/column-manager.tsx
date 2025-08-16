"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Eye, EyeOff, GripVertical } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface ColumnConfig {
  id: string
  label: string
  visible: boolean
  locked?: boolean
  width?: number
}

interface ColumnManagerProps {
  columns: ColumnConfig[]
  onColumnsChange: (columns: ColumnConfig[]) => void
}

function SortableColumnItem({ column, onToggle }: { column: ColumnConfig; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-2 rounded border bg-background ${
        isDragging ? "shadow-lg" : "hover:bg-muted/50"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <Checkbox
        id={column.id}
        checked={column.visible}
        onCheckedChange={() => onToggle(column.id)}
        disabled={column.locked}
      />

      <div className="flex-1 min-w-0">
        <label
          htmlFor={column.id}
          className={`text-sm cursor-pointer truncate block ${column.locked ? "text-muted-foreground" : ""}`}
        >
          {column.label}
        </label>
      </div>

      <div className="flex items-center gap-1">
        {column.locked && (
          <Badge variant="secondary" className="text-xs">
            Required
          </Badge>
        )}
        {column.visible ? (
          <Eye className="h-3 w-3 text-green-600" />
        ) : (
          <EyeOff className="h-3 w-3 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

export function ColumnManager({ columns, onColumnsChange }: ColumnManagerProps) {
  const [open, setOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return // Exit if not dropped over a valid target

    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id)
      const newIndex = columns.findIndex((col) => col.id === over.id)

      onColumnsChange(arrayMove(columns, oldIndex, newIndex))
    }
  }

  const toggleColumn = (columnId: string) => {
    onColumnsChange(columns.map((col) => (col.id === columnId ? { ...col, visible: !col.visible } : col)))
  }

  const showAll = () => {
    onColumnsChange(columns.map((col) => ({ ...col, visible: true })))
  }

  const hideAll = () => {
    onColumnsChange(columns.map((col) => (col.locked ? col : { ...col, visible: false })))
  }

  const resetToDefault = () => {
    // Reset to a sensible default configuration
    const defaultColumns = [
      { id: "select", label: "Select", visible: true, locked: true },
      { id: "expand", label: "Expand", visible: true, locked: true },
      { id: "deal", label: "Deal", visible: true, locked: true },
      { id: "stage", label: "Stage", visible: true },
      { id: "dealValue", label: "Deal Value", visible: true },
      { id: "owner", label: "Owner", visible: true },
      { id: "expectedClose", label: "Expected Close", visible: true },
      { id: "activitiesTimeline", label: "Activities Timeline", visible: false },
      { id: "lastInteraction", label: "Last Interaction", visible: false },
      { id: "quotesInvoices", label: "Quotes & Invoices", visible: false },
      { id: "contacts", label: "Contacts", visible: false },
      { id: "accounts", label: "Accounts", visible: false },
      { id: "forecastValue", label: "Forecast Value", visible: false },
    ]
    onColumnsChange(defaultColumns)
  }

  const visibleCount = columns.filter((col) => col.visible).length
  const totalCount = columns.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Columns
          <Badge variant="secondary" className="ml-2">
            {visibleCount}/{totalCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Manage Columns</h4>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={showAll} className="h-6 px-2 text-xs">
                Show All
              </Button>
              <Button variant="ghost" size="sm" onClick={hideAll} className="h-6 px-2 text-xs">
                Hide All
              </Button>
              <Button variant="ghost" size="sm" onClick={resetToDefault} className="h-6 px-2 text-xs">
                Reset
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Drag to reorder • Toggle visibility • Required columns cannot be hidden
          </p>
        </div>

        <ScrollArea className="h-80">
          <div className="p-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={columns.map((col) => col.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {columns.map((column) => (
                    <SortableColumnItem key={column.id} column={column} onToggle={toggleColumn} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {visibleCount} of {totalCount} columns
            </span>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-6 px-2 text-xs">
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
