"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusChipProps {
  status: string
  variant?: "default" | "outline"
  className?: string
}

const statusConfig = {
  Discovery: {
    color: "bg-blue-500 hover:bg-blue-600",
    textColor: "text-white",
    borderColor: "border-blue-500",
    icon: "🔍",
  },
  Proposal: {
    color: "bg-yellow-500 hover:bg-yellow-600",
    textColor: "text-white",
    borderColor: "border-yellow-500",
    icon: "📋",
  },
  Negotiation: {
    color: "bg-orange-500 hover:bg-orange-600",
    textColor: "text-white",
    borderColor: "border-orange-500",
    icon: "🤝",
  },
  "Closed Won": {
    color: "bg-green-500 hover:bg-green-600",
    textColor: "text-white",
    borderColor: "border-green-500",
    icon: "✅",
  },
  "Closed Lost": {
    color: "bg-red-500 hover:bg-red-600",
    textColor: "text-white",
    borderColor: "border-red-500",
    icon: "❌",
  },
}

export function StatusChip({ status, variant = "default", className }: StatusChipProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Discovery"]

  if (variant === "outline") {
    return (
      <Badge
        variant="outline"
        className={cn(`${config.borderColor} text-foreground hover:bg-muted/50 transition-colors`, className)}
      >
        <span className="mr-1">{config.icon}</span>
        {status}
      </Badge>
    )
  }

  return (
    <Badge className={cn(`${config.color} ${config.textColor} border-0 transition-colors`, className)}>
      <span className="mr-1">{config.icon}</span>
      {status}
    </Badge>
  )
}

export { StatusChip as StatusChips }
