"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"

interface ContactListProps {
  value: string
  onChange: (value: string) => void
}

export function ContactList({ value, onChange }: ContactListProps) {
  const [open, setOpen] = useState(false)
  const [newContact, setNewContact] = useState("")

  const contacts = value ? value.split(", ").filter(Boolean) : []

  const addContact = () => {
    if (newContact.trim()) {
      const updatedContacts = [...contacts, newContact.trim()]
      onChange(updatedContacts.join(", "))
      setNewContact("")
    }
  }

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index)
    onChange(updatedContacts.join(", "))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-6 px-2 py-1 justify-start">
          <div className="flex items-center gap-1 overflow-hidden">
            {contacts.length > 0 ? (
              <>
                <Badge variant="outline" className="text-xs">
                  {contacts[0]}
                </Badge>
                {contacts.length > 1 && <span className="text-xs text-muted-foreground">+{contacts.length - 1}</span>}
              </>
            ) : (
              <span className="text-xs text-muted-foreground">No contacts</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add contact..."
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addContact()
              }}
              className="h-7 text-xs"
            />
            <Button size="sm" onClick={addContact} className="h-7 px-2">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {contacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1">
                <span className="text-xs truncate">{contact}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeContact(index)}
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
