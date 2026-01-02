"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Search, Eye, Edit, Trash2, Send, MoreHorizontal, Download, Loader2, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import { useInvoices } from "@/hooks/use-invoices"
import { formatCurrency, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/types/database"

const statusFilters: (InvoiceStatus | "all")[] = ["all", "draft", "sent", "paid", "overdue"]

export default function InvoicesPage() {
  const { invoices, isLoading, error, stats, deleteInvoice, markAsPaid, markAsSent } = useInvoices()
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<InvoiceStatus | "all">("all")
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      (invoice.client?.name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return
    setActionLoading(id)
    await deleteInvoice(id)
    setActionLoading(null)
    setOpenMenu(null)
  }

  const handleMarkPaid = async (id: string) => {
    setActionLoading(id)
    await markAsPaid(id)
    setActionLoading(null)
    setOpenMenu(null)
  }

  const handleMarkSent = async (id: string) => {
    setActionLoading(id)
    await markAsSent(id)
    setActionLoading(null)
    setOpenMenu(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-2">Error loading invoices</p>
        <p className="text-sm text-muted">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Invoices</h1>
          <p className="text-muted">Manage and track all your invoices</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/invoices/new">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-semibold">{stats.totalInvoices}</p>
          <p className="text-sm text-muted">Total Invoices</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-2xl font-semibold text-emerald-600">{stats.paidInvoices}</p>
          <p className="text-sm text-emerald-600/70">Paid</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-2xl font-semibold text-blue-600">{stats.pendingInvoices}</p>
          <p className="text-sm text-blue-600/70">Pending</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-2xl font-semibold text-red-600">{stats.overdueInvoices}</p>
          <p className="text-sm text-red-600/70">Overdue</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((status) => (
            <button 
              key={status} 
              onClick={() => setStatusFilter(status)} 
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 capitalize", 
                statusFilter === status ? "bg-primary text-white" : "bg-secondary hover:bg-secondary/80"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-lg font-medium mb-1">No invoices yet</p>
          <p className="text-sm text-muted mb-6">Create your first invoice to get started</p>
          <Button variant="primary" asChild>
            <Link href="/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-xs font-medium text-muted py-4 px-6">Invoice</th>
                  <th className="text-left text-xs font-medium text-muted py-4 px-6">Client</th>
                  <th className="text-left text-xs font-medium text-muted py-4 px-6">Amount</th>
                  <th className="text-left text-xs font-medium text-muted py-4 px-6">Status</th>
                  <th className="text-left text-xs font-medium text-muted py-4 px-6">Date</th>
                  <th className="text-left text-xs font-medium text-muted py-4 px-6">Due Date</th>
                  <th className="text-right text-xs font-medium text-muted py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => {
                  const clientInitials = invoice.client?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"
                  
                  return (
                    <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors group">
                      <td className="py-4 px-6"><span className="font-medium">{invoice.invoice_number}</span></td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                            {clientInitials}
                          </div>
                          <span>{invoice.client?.name || "No client"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6"><span className="font-semibold">{formatCurrency(Number(invoice.total))}</span></td>
                      <td className="py-4 px-6"><StatusBadge status={invoice.status} /></td>
                      <td className="py-4 px-6"><span className="text-muted">{formatDate(invoice.issue_date)}</span></td>
                      <td className="py-4 px-6"><span className="text-muted">{formatDate(invoice.due_date)}</span></td>
                      <td className="py-4 px-6 text-right">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => setOpenMenu(openMenu === invoice.id ? null : invoice.id)} 
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                          >
                            {actionLoading === invoice.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4 text-muted" />
                            )}
                          </button>
                          {openMenu === invoice.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 py-1 rounded-xl bg-card border border-border shadow-lg z-10">
                              <Link href={`/invoices/${invoice.id}`} className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2">
                                <Eye className="h-4 w-4" /> View
                              </Link>
                              <Link href={`/invoices/${invoice.id}/edit`} className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2">
                                <Edit className="h-4 w-4" /> Edit
                              </Link>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2">
                                <Download className="h-4 w-4" /> Download
                              </button>
                              {invoice.status === "draft" && (
                                <button 
                                  onClick={() => handleMarkSent(invoice.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-primary"
                                >
                                  <Send className="h-4 w-4" /> Send
                                </button>
                              )}
                              {(invoice.status === "sent" || invoice.status === "viewed") && (
                                <button 
                                  onClick={() => handleMarkPaid(invoice.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-emerald-600"
                                >
                                  <CheckCircle className="h-4 w-4" /> Mark Paid
                                </button>
                              )}
                              <button 
                                onClick={() => handleDelete(invoice.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredInvoices.length === 0 && (
            <div className="text-center py-16 text-muted">
              <p className="text-lg font-medium mb-1">No invoices found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
