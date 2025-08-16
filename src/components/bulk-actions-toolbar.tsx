"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Mail, Archive, X } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: string, value?: string) => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onBulkAction,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-muted text-muted-foreground rounded-lg shadow-lg border p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className="">{selectedCount} selected</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onClearSelection}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="h-4 w-px bg-primary-foreground/20" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              // className="h-8 px-3 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => onBulkAction("delete")}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>

            <Button
              variant="ghost"
              size="sm"
              // className="h-8 px-3 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => onBulkAction("archive")}
            >
              <Archive className="h-3 w-3 mr-1" />
              Archive
            </Button>

            <Select
              onValueChange={(value) => onBulkAction("changeStage", value)}
            >
              <SelectTrigger className="h-8 w-32 bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground">
                <SelectValue placeholder="Change stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => onBulkAction("changeOwner", value)}
            >
              <SelectTrigger className="h-8 w-32 bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground">
                <SelectValue placeholder="Assign to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alex-chen">Alex Chen</SelectItem>
                <SelectItem value="sam-wilson">Sam Wilson</SelectItem>
                <SelectItem value="emma-brown">Emma Brown</SelectItem>
                <SelectItem value="james-liu">James Liu</SelectItem>
                <SelectItem value="chris-taylor">Chris Taylor</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              // className="h-8 px-3 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => onBulkAction("email")}
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
