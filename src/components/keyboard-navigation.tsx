"use client"

import { useEffect, useCallback } from "react"

interface KeyboardNavigationProps {
  onNavigate: (direction: "up" | "down" | "left" | "right") => void
  onEnterEdit: () => void
  onEscapeEdit: () => void
  onSelectRow: () => void
  onSelectAll: () => void
  disabled?: boolean
  isNavigating?: boolean
}

export function KeyboardNavigation({
  onNavigate,
  onEnterEdit,
  onEscapeEdit,
  onSelectRow,
  onSelectAll,
  disabled = false,
  isNavigating = false,
}: KeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return

      // Don't interfere with input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        if (event.key === "Escape") {
          onEscapeEdit()
        }
        return
      }

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          onNavigate("up")
          break
        case "ArrowDown":
          event.preventDefault()
          onNavigate("down")
          break
        case "ArrowLeft":
          event.preventDefault()
          onNavigate("left")
          break
        case "ArrowRight":
          event.preventDefault()
          onNavigate("right")
          break
        case "Enter":
          event.preventDefault()
          onEnterEdit()
          break
        case "Escape":
          event.preventDefault()
          onEscapeEdit()
          break
        case " ":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onSelectRow()
          }
          break
        case "a":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onSelectAll()
          }
          break
      }
    },
    [disabled, onNavigate, onEnterEdit, onEscapeEdit, onSelectRow, onSelectAll],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return null
}
