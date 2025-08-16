"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"

interface InlineEditorProps {
  value: string | number
  onChange: (value: string | number) => void
  type?: "text" | "number" | "currency"
  className?: string
}

export function InlineEditor({ value, onChange, type = "text", className }: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    if (type === "number" || type === "currency") {
      const numValue = Number.parseFloat(editValue.replace(/[^0-9.-]/g, ""))
      onChange(isNaN(numValue) ? 0 : numValue)
    } else {
      onChange(editValue)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(String(value))
    setIsEditing(false)
  }

  const formatDisplayValue = () => {
    if (type === "currency" && typeof value === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value)
    }
    return String(value)
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave()
          if (e.key === "Escape") handleCancel()
        }}
        className={`h-6 px-1 text-xs ${className}`}
        type={type === "currency" || type === "number" ? "number" : "text"}
      />
    )
  }

  return (
    <div
      className={`cursor-pointer hover:bg-muted/50 px-1 py-1 rounded text-xs truncate ${className}`}
      onClick={() => setIsEditing(true)}
      title={formatDisplayValue()}
    >
      {formatDisplayValue()}
    </div>
  )
}
