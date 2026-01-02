"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const chartData = [
  { month: "Jul", revenue: 4200 },
  { month: "Aug", revenue: 5800 },
  { month: "Sep", revenue: 4900 },
  { month: "Oct", revenue: 7200 },
  { month: "Nov", revenue: 6100 },
  { month: "Dec", revenue: 8920 },
]

const maxRevenue = Math.max(...chartData.map((d) => d.revenue))

export function RevenueChart() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [selectedPeriod, setSelectedPeriod] = React.useState("6M")

  return (
    <div className="p-6 rounded-2xl bg-card border border-border h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Revenue Overview</h3>
          <p className="text-sm text-muted">Last 6 months performance</p>
        </div>
        <div className="flex gap-1 p-1 rounded-full bg-secondary">
          {["6M", "1Y", "All"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                selectedPeriod === period
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-3 h-48">
        {chartData.map((data, index) => (
          <div
            key={data.month}
            className="flex-1 flex flex-col items-center gap-2"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full flex flex-col items-center">
              {/* Tooltip */}
              <div
                className={cn(
                  "absolute -top-8 px-2.5 py-1 rounded-lg bg-foreground text-background text-xs font-medium transition-all duration-200",
                  hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                )}
              >
                ${(data.revenue / 1000).toFixed(1)}k
              </div>
              
              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-lg transition-all duration-200 cursor-pointer",
                  hoveredIndex === index ? "bg-primary" : "bg-primary/20"
                )}
                style={{
                  height: `${(data.revenue / maxRevenue) * 150}px`,
                }}
              />
            </div>
            <span className={cn(
              "text-xs transition-colors duration-200",
              hoveredIndex === index ? "text-foreground font-medium" : "text-muted"
            )}>
              {data.month}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted">Total Revenue</p>
          <p className="text-lg font-semibold">$37,120</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Avg. Monthly</p>
          <p className="text-lg font-semibold">$6,187</p>
        </div>
      </div>
    </div>
  )
}
