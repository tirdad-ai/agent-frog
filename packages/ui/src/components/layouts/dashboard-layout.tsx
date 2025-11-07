"use client";

import * as React from "react";
import { cn } from "@repo/ui/lib/utils";
import { Sidebar, SidebarTrigger } from "../base/sidebar";
import { Separator } from "../base/separator";

// Re-export shadcn Sidebar components for convenience
export {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../base/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  children: React.ReactNode;
  /**
   * Side of the sidebar - "left" for LTR languages, "right" for RTL languages
   * Default: "left"
   */
  side?: "left" | "right";
}

interface DashboardHeaderProps {
  title?: string | React.JSX.Element;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * AppSidebar - A reusable sidebar component with RTL support
 * Wrap your navigation content here
 * @param side - "left" for LTR (en), "right" for RTL (ar)
 */
export function AppSidebar({
  children,
  side = "left",
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" side={side} {...props}>
      {children}
    </Sidebar>
  );
}

/**
 * DashboardHeader - Page header with title, description and actions
 */
export function DashboardHeader({
  title,
  description,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center gap-2 border-b px-4",
        className,
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col gap-1">
          {title && <h1 className="text-lg font-semibold">{title}</h1>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
