"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import type { Client } from "@/types/database"

export function useClients() {
  const { user } = useAuth()
  const [clients, setClients] = React.useState<Client[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchClients = React.useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setClients((data as Client[]) || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const addClient = async (clientData: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return { error: new Error("Not authenticated") }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("clients")
        .insert({
          ...clientData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      
      setClients((prev) => [data as Client, ...prev])
      return { data: data as Client, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      
      setClients((prev) => prev.map((c) => (c.id === id ? (data as Client) : c)))
      return { data: data as Client, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id)

      if (error) throw error
      
      setClients((prev) => prev.filter((c) => c.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    createClient: addClient,
    updateClient,
    deleteClient,
  }
}
