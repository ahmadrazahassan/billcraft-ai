"use client"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { InvoiceTable } from "@/components/dashboard/invoice-table"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ClientList } from "@/components/dashboard/client-list"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there"
  
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <p className="text-muted">Welcome back, {displayName}! Here&apos;s your business overview.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="px-4 py-2 rounded-full bg-secondary text-sm">
            <span className="text-muted">Today:</span>{" "}
            <span className="font-medium">{today}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Charts & Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <QuickActions />
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InvoiceTable />
        </div>
        <ClientList />
      </div>
    </div>
  )
}
