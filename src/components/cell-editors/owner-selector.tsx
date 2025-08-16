"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check } from "lucide-react"

const OWNERS = [
  { id: "alex-chen", name: "Alex Chen", initials: "AC" },
  { id: "sam-wilson", name: "Sam Wilson", initials: "SW" },
  { id: "emma-brown", name: "Emma Brown", initials: "EB" },
  { id: "james-liu", name: "James Liu", initials: "JL" },
  { id: "chris-taylor", name: "Chris Taylor", initials: "CT" },
]

interface OwnerSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function OwnerSelector({ value, onChange }: OwnerSelectorProps) {
  const [open, setOpen] = useState(false)
  const currentOwner = OWNERS.find((owner) => owner.name === value) || OWNERS[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-6 px-2 py-1 justify-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-4 w-4">
              <AvatarFallback className="text-xs">{currentOwner.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs truncate">{currentOwner.name}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        {OWNERS.map((owner) => (
          <Button
            key={owner.id}
            variant="ghost"
            className="w-full justify-start h-8 px-2"
            onClick={() => {
              onChange(owner.name)
              setOpen(false)
            }}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-xs">{owner.initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{owner.name}</span>
            </div>
            {currentOwner.id === owner.id && <Check className="ml-auto h-3 w-3" />}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
