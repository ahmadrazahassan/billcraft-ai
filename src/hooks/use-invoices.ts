"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import type { Invoice, InvoiceItem } from "@/types/database"

export interface InvoiceWithItems extends Invoice {
  items?: InvoiceItem[]
  client?: {
    id: string
    name: string
    email: string
    company: string | null
  } | null
}

export function useInvoices() {
  const { user } = useAuth()
  const [invoices, setInvoices] = React.useState<InvoiceWithItems[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchInvoices = React.useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("invoices")
        .select(`
          *,
          client:clients(id, name, email, company)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setInvoices((data as InvoiceWithItems[]) || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const getInvoice = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select(`
          *,
          client:clients(id, name, email, company, address, city, state, zip, country)
        `)
        .eq("id", id)
        .single()

      if (invoiceError) throw invoiceError

      const { data: items, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id)
        .order("created_at", { ascending: true })

      if (itemsError) throw itemsError

      return { data: { ...invoice, items } as InvoiceWithItems, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  const createInvoice = async (
    invoiceData: Omit<Invoice, "id" | "user_id" | "created_at" | "updated_at">,
    items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[]
  ) => {
    if (!user) return { error: new Error("Not authenticated") }

    try {
      const supabase = createClient()
      
      // Generate invoice number
      const { count } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      const year = new Date().getFullYear()
      const invoiceNumber = `INV-${year}-${String((count || 0) + 1).padStart(4, "0")}`

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          ...invoiceData,
          user_id: user.id,
          invoice_number: invoiceNumber,
        })
        .select()
        .single()

      if (invoiceError) throw invoiceError

      // Create invoice items
      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(
            items.map((item) => ({
              ...item,
              invoice_id: (invoice as Invoice).id,
            }))
          )

        if (itemsError) throw itemsError
      }

      await fetchInvoices()
      return { data: invoice as Invoice, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  const updateInvoice = async (
    id: string,
    updates: Partial<Invoice>,
    items?: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[]
  ) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("invoices")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Update items if provided
      if (items) {
        // Delete existing items
        await supabase.from("invoice_items").delete().eq("invoice_id", id)

        // Insert new items
        if (items.length > 0) {
          await supabase.from("invoice_items").insert(
            items.map((item) => ({
              ...item,
              invoice_id: id,
            }))
          )
        }
      }

      await fetchInvoices()
      return { data: data as Invoice, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("invoices").delete().eq("id", id)

      if (error) throw error

      setInvoices((prev) => prev.filter((i) => i.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const markAsPaid = async (id: string) => {
    return updateInvoice(id, {
      status: "paid",
      paid_at: new Date().toISOString(),
    })
  }

  const markAsSent = async (id: string) => {
    return updateInvoice(id, {
      status: "sent",
      sent_at: new Date().toISOString(),
    })
  }

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalRevenue = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + Number(i.total), 0)

    const pendingAmount = invoices
      .filter((i) => i.status === "sent")
      .reduce((sum, i) => sum + Number(i.total), 0)

    const overdueAmount = invoices
      .filter((i) => i.status === "overdue")
      .reduce((sum, i) => sum + Number(i.total), 0)

    const thisMonth = invoices.filter((i) => {
      const date = new Date(i.created_at)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter((i) => i.status === "paid").length,
      pendingInvoices: invoices.filter((i) => i.status === "sent").length,
      overdueInvoices: invoices.filter((i) => i.status === "overdue").length,
      thisMonthInvoices: thisMonth.length,
      thisMonthRevenue: thisMonth
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + Number(i.total), 0),
    }
  }, [invoices])

  return {
    invoices,
    isLoading,
    error,
    stats,
    refetch: fetchInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    markAsSent,
  }
}
