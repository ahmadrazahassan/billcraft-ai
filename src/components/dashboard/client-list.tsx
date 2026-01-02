"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface Client {
  id: string
  name: string
  email: string
  avatar: string
  totalInvoiced: number
}

const clients: Client[] = [
  { id: "1", name: "Acme Corp", email: "billing@acme.com", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face", totalInvoiced: 12500 },
  { id: "2", name: "Tech Solutions", email: "accounts@techsolutions.com", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face", totalInvoiced: 8400 },
  { id: "3", name: "Design Studio", email: "hello@designstudio.co", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face", totalInvoiced: 5600 },
  { id: "4", name: "Marketing Co", email: "finance@marketingco.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", totalInvoiced: 15200 },
]

export function ClientList() {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold">Top Clients</h3>
          <p className="text-sm text-muted">By revenue</p>
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link href="/clients/new">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-2 flex-1">
        {clients.map((client, index) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-secondary text-[10px] font-medium flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{client.name}</p>
                <p className="text-xs text-muted truncate max-w-[120px]">{client.email}</p>
              </div>
            </div>
            <span className="font-semibold text-sm">{formatCurrency(client.totalInvoiced)}</span>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-4 gap-1 text-primary hover:text-primary" asChild>
        <Link href="/clients">
          View All Clients
          <ArrowRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  )
}
