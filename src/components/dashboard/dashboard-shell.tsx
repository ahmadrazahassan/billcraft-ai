"use client"

import * as React from "react"
import { Sidebar, SidebarProvider, useSidebar } from "@/components/dashboard/sidebar"
import { TrialBanner } from "@/components/dashboard/trial-banner"

function ShellContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main 
        className="transition-all duration-300 ease-out"
        style={{ paddingLeft: collapsed ? "76px" : "260px" }}
      >
        <TrialBanner />
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ShellContent>{children}</ShellContent>
    </SidebarProvider>
  )
}
