"use client"

import Link from "next/link"
import { Eye, Edit, ArrowRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue"

interface Invoice {
  id: string
  number: string
  client: string
  clientAvatar: string
  amount: number
  status: InvoiceStatus
  date: string
}

const invoices: Invoice[] = [
  { id: "1", number: "INV-001", client: "Acme Corp", clientAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", amount: 2500, status: "paid", date: "2025-12-28" },
  { id: "2", number: "INV-002", client: "Tech Solutions", clientAvatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", amount: 4200, status: "sent", date: "2025-12-25" },
  { id: "3", number: "INV-003", client: "Design Studio", clientAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", amount: 1800, status: "overdue", date: "2025-12-15" },
  { id: "4", number: "INV-004", client: "Marketing Co", clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", amount: 3500, status: "draft", date: "2025-12-30" },
  { id: "5", number: "INV-005", client: "Startup Inc", clientAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face", amount: 1200, status: "paid", date: "2025-12-20" },
]

export function InvoiceTable() {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold">Recent Invoices</h3>
          <p className="text-sm text-muted">Your latest transactions</p>
        </div>
        <Button variant="ghost" size="sm" asChild className="gap-1 text-primary hover:text-primary">
          <Link href="/invoices">
            View All
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <img
                src={invoice.clientAvatar}
                alt={invoice.client}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{invoice.client}</p>
                <p className="text-xs text-muted">{invoice.number} • {formatDate(invoice.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <StatusBadge status={invoice.status} />
              <span className="font-semibold text-sm min-w-[70px] text-right">
                {formatCurrency(invoice.amount)}
              </span>
              <button className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                <MoreHorizontal className="h-4 w-4 text-muted" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
