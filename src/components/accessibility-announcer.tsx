"use client"

import { useEffect, useRef } from "react"

interface AccessibilityAnnouncerProps {
  message: string
  priority?: "polite" | "assertive"
}

export function AccessibilityAnnouncer({ message, priority = "polite" }: AccessibilityAnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (message && announcerRef.current) {
      // Clear and set the message to trigger screen reader announcement
      announcerRef.current.textContent = ""
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message
        }
      }, 100)
    }
  }, [message])

  return <div ref={announcerRef} aria-live={priority} aria-atomic="true" className="sr-only" />
}
