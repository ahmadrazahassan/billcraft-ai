
"use client"

import * as React from "react"
import { DollarSign, FileText, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { DashboardStats as DashboardStatsType } from "@/types/database"

const colorMap = {
  primary: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-600",
  blue: "bg-blue-500/10 text-blue-600",
  emerald: "bg-emerald-500/10 text-emerald-600",
}

export function DashboardStats() {
  const { user } = useAuth()
  const [stats, setStats] = React.useState<DashboardStatsType | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      if (!user) return

      try {
        const supabase = createClient()
        
        // Fetch stats using the database function
        const { data, error } = await supabase.rpc("get_dashboard_stats", {
          p_user_id: user.id
        })

        if (error) {
          console.error("Error fetching stats:", error)
          // Fallback to manual calculation
          await fetchStatsManually(supabase, user.id)
        } else {
          setStats(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchStatsManually(supabase: ReturnType<typeof createClient>, userId: string) {
      // Fetch invoices
      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)

      // Fetch clients
      const { data: clients } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", userId)
        .eq("is_active", true)

      if (invoices) {
        const now = new Date()
        const thisMonth = invoices.filter(i => {
          const date = new Date(i.created_at)
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        })

        const lastMonth = invoices.filter(i => {
          const date = new Date(i.paid_at || i.created_at)
          const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear()
        })

        setStats({
          total_revenue: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.total), 0),
          pending_amount: invoices.filter(i => i.status === "sent" || i.status === "viewed").reduce((sum, i) => sum + Number(i.amount_due), 0),
          overdue_amount: invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + Number(i.amount_due), 0),
          total_invoices: invoices.length,
          paid_invoices: invoices.filter(i => i.status === "paid").length,
          pending_invoices: invoices.filter(i => i.status === "sent" || i.status === "viewed").length,
          overdue_invoices: invoices.filter(i => i.status === "overdue").length,
          draft_invoices: invoices.filter(i => i.status === "draft").length,
          total_clients: clients?.length || 0,
          this_month_revenue: thisMonth.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.total), 0),
          last_month_revenue: lastMonth.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.total), 0),
          this_month_invoices: thisMonth.length,
        })
      }
    }

    fetchStats()
  }, [user])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary" />
              <div className="w-16 h-6 rounded-full bg-secondary" />
            </div>
            <div className="h-8 w-24 bg-secondary rounded mb-1" />
            <div className="h-4 w-20 bg-secondary rounded" />
          </div>
        ))}
      </div>
    )
  }

  const revenueChange = stats?.last_month_revenue 
    ? ((stats.this_month_revenue - stats.last_month_revenue) / stats.last_month_revenue * 100).toFixed(1)
    : "0"

  const statItems = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.total_revenue || 0),
      change: `${Number(revenueChange) >= 0 ? "+" : ""}${revenueChange}%`,
      trend: Number(revenueChange) >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "primary",
    },
    {
      label: "Pending Invoices",
      value: String(stats?.pending_invoices || 0),
      change: formatCurrency(stats?.pending_amount || 0),
      trend: "neutral",
      icon: FileText,
      color: "amber",
    },
    {
      label: "Active Clients",
      value: String(stats?.total_clients || 0),
      change: `${stats?.total_invoices || 0} invoices`,
      trend: "neutral",
      icon: Users,
      color: "blue",
    },
    {
      label: "This Month",
      value: formatCurrency(stats?.this_month_revenue || 0),
      change: `${stats?.this_month_invoices || 0} invoices`,
      trend: "up",
      icon: TrendingUp,
      color: "emerald",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="p-5 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              colorMap[stat.color as keyof typeof colorMap]
            )}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              stat.trend === "up" ? "bg-emerald-500/10 text-emerald-600" : 
              stat.trend === "down" ? "bg-red-500/10 text-red-600" :
              "bg-muted/20 text-muted"
            )}>
              {stat.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
              {stat.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
              {stat.change}
            </div>
          </div>
          <p className="text-2xl font-semibold mb-1">{stat.value}</p>
          <p className="text-sm text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
