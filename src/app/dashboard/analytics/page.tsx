"use client"

import { BarChart3, TrendingUp, Users, FileText } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted">Track your business performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted">Total Invoices</span>
          </div>
          <p className="text-3xl font-semibold">0</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted">Revenue</span>
          </div>
          <p className="text-3xl font-semibold">$0</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted">Clients</span>
          </div>
          <p className="text-3xl font-semibold">0</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-sm text-muted">Avg Invoice</span>
          </div>
          <p className="text-3xl font-semibold">$0</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-card border border-border text-center">
        <BarChart3 className="h-12 w-12 mx-auto text-muted mb-4" />
        <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
        <p className="text-muted text-sm max-w-md mx-auto">
          Detailed charts and insights about your invoicing activity will be available here.
          Start creating invoices to see your data.
        </p>
      </div>
    </div>
  )
}
