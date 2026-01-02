"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Mail, Phone, FileText, ArrowUpRight, Loader2, Trash2, Edit, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useClients } from "@/hooks/use-clients"
import { formatDate } from "@/lib/utils"
import type { Client } from "@/types/database"

export default function ClientsPage() {
  const { clients, isLoading, error, deleteClient } = useClients()
  const [search, setSearch] = React.useState("")
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      (client.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return
    setDeletingId(id)
    await deleteClient(id)
    setDeletingId(null)
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
        <p className="text-destructive mb-2">Error loading clients</p>
        <p className="text-sm text-muted">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Clients</h1>
          <p className="text-muted">Manage your client relationships</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-semibold">{clients.length}</p>
          <p className="text-sm text-muted">Total Clients</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-2xl font-semibold text-emerald-600">
            {clients.filter(c => c.is_active).length}
          </p>
          <p className="text-sm text-emerald-600/70">Active</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-semibold">
            {clients.filter(c => {
              const created = new Date(c.created_at)
              const now = new Date()
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
            }).length}
          </p>
          <p className="text-sm text-muted">Added This Month</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border">
          <Building2 className="h-12 w-12 text-muted mx-auto mb-4" />
          <p className="text-lg font-medium mb-1">No clients yet</p>
          <p className="text-sm text-muted mb-6">Add your first client to get started</p>
          <Button variant="primary" asChild>
            <Link href="/clients/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <ClientCard 
              key={client.id} 
              client={client}
              isMenuOpen={openMenu === client.id}
              onMenuToggle={() => setOpenMenu(openMenu === client.id ? null : client.id)}
              onDelete={() => handleDelete(client.id)}
              isDeleting={deletingId === client.id}
            />
          ))}
        </div>
      )}

      {filteredClients.length === 0 && clients.length > 0 && (
        <div className="text-center py-16 text-muted">
          <p className="text-lg font-medium mb-1">No clients found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      )}
    </div>
  )
}

function ClientCard({ 
  client, 
  isMenuOpen, 
  onMenuToggle, 
  onDelete,
  isDeleting 
}: { 
  client: Client
  isMenuOpen: boolean
  onMenuToggle: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  const initials = client.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  
  return (
    <div className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {initials}
          </div>
          <div>
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-muted">{client.company || "No company"}</p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={onMenuToggle}
            className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all"
          >
            <MoreHorizontal className="h-4 w-4 text-muted" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 py-1 rounded-xl bg-card border border-border shadow-lg z-10">
              <Link 
                href={`/clients/${client.id}/edit`}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2"
              >
                <Edit className="h-4 w-4" /> Edit
              </Link>
              <button 
                onClick={onDelete}
                disabled={isDeleting}
                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 text-destructive disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{client.email}</span>
        </div>
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-xs text-muted">
          Added {formatDate(client.created_at)}
        </span>
        <Button variant="outline" size="sm" asChild className="gap-1">
          <Link href={`/invoices/new?client=${client.id}`}>
            <FileText className="h-3 w-3" />
            Invoice
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
