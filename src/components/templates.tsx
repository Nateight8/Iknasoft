"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconPlus } from "@tabler/icons-react";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

export default function Templates({
  selectedTemplates,
  onTemplateToggle,
}: {
  selectedTemplates: string[];
  onTemplateToggle: (templateId: string, isSelected: boolean) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative"
          aria-label="Open templates"
        >
          <IconPlus size={16} aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">
            Core columns for your Deal board
          </div>
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        <ScrollArea className="h-[300px]">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-muted/50"
            >
              <Checkbox
                id={template.id}
                checked={selectedTemplates.includes(template.id)}
                onCheckedChange={(checked) =>
                  onTemplateToggle(template.id, checked === true)
                }
              />
              <label
                htmlFor={template.id}
                className="text-sm cursor-pointer flex-1"
              >
                <div className="font-medium">{template.label}</div>
                <div className="text-muted-foreground text-xs">
                  {template.description}
                </div>
              </label>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

const templates = [
  {
    id: "stage",
    label: "Stage",
    description: "Current stage of the deal in the sales pipeline",
  },
  {
    id: "dealValue",
    label: "Deal Value",
    description: "Total monetary value of the deal",
  },
  {
    id: "contacts",
    label: "Contacts",
    description: "Key contacts involved in this deal",
  },
  {
    id: "owner",
    label: "Owner",
    description: "Sales representative responsible for this deal",
  },
];
