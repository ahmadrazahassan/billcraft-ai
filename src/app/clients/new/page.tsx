"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Building, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useClients } from "@/hooks/use-clients"

export default function NewClientPage() {
  const router = useRouter()
  const { createClient } = useClients()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    country: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError("Client name is required")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const { error: createError } = await createClient({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      company: formData.company.trim() || null,
      address: formData.address.trim() || null,
      city: formData.city.trim() || null,
      state: null,
      zip: null,
      country: formData.country.trim() || null,
      tax_id: null,
      website: null,
      notes: formData.notes.trim() || null,
      is_active: true,
    })

    setIsSubmitting(false)

    if (createError) {
      setError(createError.message)
      return
    }

    router.push("/clients")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild type="button">
          <Link href="/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold mb-1">Add Client</h1>
          <p className="text-muted">Create a new client profile</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <p className="text-sm text-muted">Basic contact details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name *</label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Smith" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email *</label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-0100" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Company</label>
              <Input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Address</h3>
            <p className="text-sm text-muted">Location details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Street Address</label>
            <Input name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="New York" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <Input name="country" value={formData.country} onChange={handleChange} placeholder="United States" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Additional Notes</h3>
            <p className="text-sm text-muted">Any extra information</p>
          </div>
        </div>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this client..."
          className="w-full h-24 rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none transition-all duration-200 focus:border-primary/40 focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild type="button">
          <Link href="/clients">Cancel</Link>
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? "Saving..." : "Save Client"}
        </Button>
      </div>
    </form>
  )
}
