"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { StatusChip } from "../status-chips"

const STAGES = [
  { id: "discovery", label: "Discovery" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed-won", label: "Closed Won" },
  { id: "closed-lost", label: "Closed Lost" },
]

interface StageSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function StageSelector({ value, onChange }: StageSelectorProps) {
  const [open, setOpen] = useState(false)
  const currentStage = STAGES.find((stage) => stage.label === value) || STAGES[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-6 px-2 py-1 justify-start">
          <StatusChip status={currentStage.label} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        {STAGES.map((stage) => (
          <Button
            key={stage.id}
            variant="ghost"
            className="w-full justify-start h-8 px-2"
            onClick={() => {
              onChange(stage.label)
              setOpen(false)
            }}
          >
            <StatusChip status={stage.label} className="mr-2" />
            {currentStage.id === stage.id && <Check className="ml-auto h-3 w-3" />}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
