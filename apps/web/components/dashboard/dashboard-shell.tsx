"use client";

import { SidebarProvider, SidebarInset } from "@repo/ui";
import { AppSidebar } from "./app-sidebar";
import { DashboardHeader } from "./dashboard-header";

interface DashboardShellProps {
  children: React.ReactNode;
  session: any; // TODO: Type this properly
}

export function DashboardShell({ children, session }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <DashboardHeader session={session} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
