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
import { Copy, Edit, Trash2, Archive, Mail, Phone, User, Calendar, DollarSign } from "lucide-react"

interface Deal {
  id: string
  deal: string
  stage: string
  dealValue: number
  owner: string
  expectedClose: string
}

interface RowContextMenuProps {
  children: React.ReactNode
  deal: Deal
  onAction: (action: string, dealId: string, value?: string) => void
}

export function RowContextMenu({ children, deal, onAction }: RowContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="contents">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onAction("edit", deal.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Deal
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction("duplicate", deal.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Deal
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <User className="mr-2 h-4 w-4" />
            Change Owner
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => onAction("changeOwner", deal.id, "Alex Chen")}>Alex Chen</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeOwner", deal.id, "Sam Wilson")}>Sam Wilson</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeOwner", deal.id, "Emma Brown")}>Emma Brown</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeOwner", deal.id, "James Liu")}>James Liu</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeOwner", deal.id, "Chris Taylor")}>
              Chris Taylor
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <DollarSign className="mr-2 h-4 w-4" />
            Change Stage
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => onAction("changeStage", deal.id, "Discovery")}>Discovery</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeStage", deal.id, "Proposal")}>Proposal</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeStage", deal.id, "Negotiation")}>
              Negotiation
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeStage", deal.id, "Closed Won")}>Closed Won</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("changeStage", deal.id, "Closed Lost")}>
              Closed Lost
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onAction("email", deal.id)}>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction("call", deal.id)}>
          <Phone className="mr-2 h-4 w-4" />
          Schedule Call
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction("meeting", deal.id)}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Meeting
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onAction("archive", deal.id)}>
          <Archive className="mr-2 h-4 w-4" />
          Archive Deal
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onAction("delete", deal.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Deal
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
