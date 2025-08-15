"use client";

import * as React from "react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent className="gap-0 mt-3 pt-3"></SidebarContent>
    </Sidebar>
  );
}
