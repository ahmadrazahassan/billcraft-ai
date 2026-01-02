"use client"

import * as React from "react"
import { useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  Plus, Trash2, Send, Save, Download, Upload,
  Building2, User, FileText, ChevronDown, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { templates as invoiceTemplates } from "@/lib/templates"
import { useClients } from "@/hooks/use-clients"
import { useInvoices } from "@/hooks/use-invoices"
import { useAuth } from "@/contexts/auth-context"

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
}

interface InvoiceData {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyLogo: string | null
  clientId: string | null
  clientName: string
  clientEmail: string
  clientAddress: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  lineItems: LineItem[]
  tax: number
  discount: number
  notes: string
  template: string
}

export function InvoiceCreator() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateParam = searchParams.get('template')
  
  const { clients, isLoading: clientsLoading } = useClients()
  const { createInvoice } = useInvoices()
  const { profile } = useAuth()
  
  const invoiceRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"details" | "preview">("details")
  const [showClientDropdown, setShowClientDropdown] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)
  
  const [invoiceData, setInvoiceData] = React.useState<InvoiceData>({
    companyName: "Your Company",
    companyEmail: "hello@company.com",
    companyPhone: "+1 555-0100",
    companyAddress: "123 Business Street, City, State 12345",
    companyLogo: null,
    clientId: null,
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    invoiceNumber: "INV-001",
    invoiceDate: "2026-01-02",
    dueDate: "2026-01-16",
    lineItems: [{ id: "1", description: "", quantity: 1, rate: 0 }],
    tax: 0,
    discount: 0,
    notes: "",
    template: templateParam || "minimal",
  })

  // Load profile data and generate invoice number on client side
  React.useEffect(() => {
    setIsClient(true)
    setInvoiceData(prev => ({
      ...prev,
      companyName: profile?.company_name || prev.companyName,
      companyEmail: profile?.company_email || profile?.email || prev.companyEmail,
      companyPhone: profile?.company_phone || prev.companyPhone,
      companyAddress: [profile?.company_address, profile?.company_city, profile?.company_state, profile?.company_zip].filter(Boolean).join(", ") || prev.companyAddress,
      companyLogo: profile?.company_logo || null,
      invoiceNumber: `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      template: templateParam || prev.template,
    }))
  }, [templateParam, profile])

  const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const taxAmount = subtotal * (invoiceData.tax / 100)
  const discountAmount = subtotal * (invoiceData.discount / 100)
  const total = subtotal + taxAmount - discountAmount
  
  const selectedTemplate = invoiceTemplates.find(t => t.id === invoiceData.template) || invoiceTemplates[0]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setInvoiceData({ ...invoiceData, companyLogo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const addLineItem = () => {
    setInvoiceData({
      ...invoiceData,
      lineItems: [...invoiceData.lineItems, { id: Date.now().toString(), description: "", quantity: 1, rate: 0 }]
    })
  }

  const removeLineItem = (id: string) => {
    if (invoiceData.lineItems.length > 1) {
      setInvoiceData({
        ...invoiceData,
        lineItems: invoiceData.lineItems.filter((item) => item.id !== id)
      })
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData({
      ...invoiceData,
      lineItems: invoiceData.lineItems.map((item) => item.id === id ? { ...item, [field]: value } : item)
    })
  }

  const selectClient = (client: typeof clients[0]) => {
    const clientAddress = [client.address, client.city, client.state, client.zip, client.country].filter(Boolean).join(", ")
    setInvoiceData({
      ...invoiceData,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientAddress: clientAddress,
    })
    setShowClientDropdown(false)
  }

  const saveInvoice = async (status: "draft" | "sent") => {
    if (!invoiceData.clientId && !invoiceData.clientName) {
      setSaveError("Please select or enter a client")
      return
    }

    const hasItems = invoiceData.lineItems.some(item => item.description.trim())
    if (!hasItems) {
      setSaveError("Please add at least one line item")
      return
    }

    if (status === "draft") {
      setIsSaving(true)
    } else {
      setIsSending(true)
    }
    setSaveError(null)

    const invoicePayload = {
      client_id: invoiceData.clientId,
      invoice_number: invoiceData.invoiceNumber,
      status: status,
      template_id: invoiceData.template,
      issue_date: invoiceData.invoiceDate,
      due_date: invoiceData.dueDate,
      subtotal: subtotal,
      tax_rate: invoiceData.tax,
      tax_amount: taxAmount,
      discount_rate: invoiceData.discount,
      discount_amount: discountAmount,
      shipping_amount: 0,
      total: total,
      amount_paid: 0,
      amount_due: total,
      currency: "USD",
      notes: invoiceData.notes || null,
      terms: null,
      footer: null,
      viewed_at: null,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      paid_at: null,
      canceled_at: null,
      payment_method: null,
      payment_reference: null,
    }

    const items = invoiceData.lineItems
      .filter(item => item.description.trim())
      .map((item, index) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.quantity * item.rate,
        unit: null,
        tax_rate: null,
        discount_rate: null,
        sort_order: index,
      }))

    const { error } = await createInvoice(invoicePayload as Parameters<typeof createInvoice>[0], items)

    setIsSaving(false)
    setIsSending(false)

    if (error) {
      setSaveError(error.message)
      return
    }

    router.push("/invoices")
  }

  const downloadPDF = async () => {
    if (!invoiceRef.current) return
    setIsDownloading(true)
    
    try {
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const color = selectedTemplate.color
      
      // Convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 }
      }
      
      const rgb = hexToRgb(color)
      
      // Header
      pdf.setFontSize(28)
      pdf.setTextColor(rgb.r, rgb.g, rgb.b)
      pdf.text('INVOICE', 20, 30)
      
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(invoiceData.invoiceNumber, 20, 38)
      
      // Company Info (right side)
      pdf.setFontSize(12)
      pdf.setTextColor(30, 30, 30)
      pdf.text(invoiceData.companyName || 'Your Company', pageWidth - 20, 25, { align: 'right' })
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text(invoiceData.companyEmail, pageWidth - 20, 32, { align: 'right' })
      pdf.text(invoiceData.companyPhone, pageWidth - 20, 38, { align: 'right' })
      
      // Divider line
      pdf.setDrawColor(rgb.r, rgb.g, rgb.b)
      pdf.setLineWidth(0.5)
      pdf.line(20, 48, pageWidth - 20, 48)
      
      // Bill To section
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text('BILL TO', 20, 60)
      
      pdf.setFontSize(11)
      pdf.setTextColor(30, 30, 30)
      pdf.text(invoiceData.clientName || 'Client Name', 20, 68)
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text(invoiceData.clientEmail || '', 20, 74)
      pdf.text(invoiceData.clientAddress || '', 20, 80)
      
      // Invoice Details (right side)
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text('INVOICE DATE', pageWidth - 60, 60)
      pdf.text('DUE DATE', pageWidth - 60, 75)
      
      pdf.setFontSize(10)
      pdf.setTextColor(30, 30, 30)
      pdf.text(formatDate(invoiceData.invoiceDate), pageWidth - 60, 67)
      pdf.text(formatDate(invoiceData.dueDate), pageWidth - 60, 82)
      
      // Line Items Table
      const tableData = invoiceData.lineItems
        .filter(item => item.description)
        .map(item => [
          item.description,
          item.quantity.toString(),
          formatCurrency(item.rate),
          formatCurrency(item.quantity * item.rate)
        ])
      
      if (tableData.length === 0) {
        tableData.push(['No items added', '', '', '$0.00'])
      }
      
      autoTable(pdf, {
        startY: 95,
        head: [['Description', 'Qty', 'Rate', 'Amount']],
        body: tableData,
        theme: 'plain',
        headStyles: {
          fillColor: [rgb.r, rgb.g, rgb.b],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [50, 50, 50],
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 25, halign: 'right' },
          2: { cellWidth: 35, halign: 'right' },
          3: { cellWidth: 35, halign: 'right' },
        },
        margin: { left: 20, right: 20 },
      })
      
      // Get the Y position after the table
      const finalY = (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
      
      // Totals
      const totalsX = pageWidth - 70
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text('Subtotal:', totalsX, finalY)
      pdf.setTextColor(30, 30, 30)
      pdf.text(formatCurrency(subtotal), pageWidth - 20, finalY, { align: 'right' })
      
      let currentY = finalY + 7
      
      if (invoiceData.tax > 0) {
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Tax (${invoiceData.tax}%):`, totalsX, currentY)
        pdf.setTextColor(30, 30, 30)
        pdf.text(formatCurrency(taxAmount), pageWidth - 20, currentY, { align: 'right' })
        currentY += 7
      }
      
      if (invoiceData.discount > 0) {
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Discount (${invoiceData.discount}%):`, totalsX, currentY)
        pdf.setTextColor(30, 30, 30)
        pdf.text(`-${formatCurrency(discountAmount)}`, pageWidth - 20, currentY, { align: 'right' })
        currentY += 7
      }
      
      // Total line
      pdf.setDrawColor(rgb.r, rgb.g, rgb.b)
      pdf.line(totalsX - 5, currentY + 2, pageWidth - 20, currentY + 2)
      
      pdf.setFontSize(12)
      pdf.setTextColor(rgb.r, rgb.g, rgb.b)
      pdf.text('Total:', totalsX, currentY + 12)
      pdf.setFontSize(14)
      pdf.text(formatCurrency(total), pageWidth - 20, currentY + 12, { align: 'right' })
      
      // Notes
      if (invoiceData.notes) {
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text('NOTES', 20, currentY + 30)
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text(invoiceData.notes, 20, currentY + 38, { maxWidth: pageWidth - 40 })
      }
      
      // Footer
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' })
      
      pdf.save(`${invoiceData.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Left Panel - Form */}
      <div className="lg:col-span-2 space-y-5">
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex gap-2 p-1 rounded-xl bg-secondary">
          <button
            onClick={() => setActiveTab("details")}
            className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all", activeTab === "details" ? "bg-card shadow-sm" : "")}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all", activeTab === "preview" ? "bg-card shadow-sm" : "")}
          >
            Preview
          </button>
        </div>

        <div className={cn("space-y-5", activeTab === "preview" && "hidden lg:block")}>
          {/* Template Selection */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold mb-4">Choose Template ({invoiceTemplates.length} available)</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {invoiceTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setInvoiceData({ ...invoiceData, template: template.id })}
                  className={cn(
                    "p-2.5 rounded-xl text-center transition-all duration-200 relative",
                    invoiceData.template === template.id ? "bg-foreground text-background ring-2 ring-primary" : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {template.popular && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                  {template.new && (
                    <span className="absolute -top-1 -right-1 text-[8px] bg-primary text-white px-1 rounded">NEW</span>
                  )}
                  <div className="w-5 h-5 rounded-md mx-auto mb-1.5" style={{ backgroundColor: template.color }} />
                  <p className="text-[10px] font-medium truncate">{template.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Company Details */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">Your Company</h3>
            </div>
            
            {/* Logo Upload */}
            <div className="mb-4">
              <label className="text-xs font-medium text-muted mb-2 block">Company Logo</label>
              <div className="flex items-center gap-3">
                {invoiceData.companyLogo ? (
                  <img src={invoiceData.companyLogo} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-secondary" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted">
                    <Building2 className="h-5 w-5" />
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-3 w-3 mr-1" /> Upload
                </Button>
                {invoiceData.companyLogo && (
                  <Button variant="ghost" size="sm" onClick={() => setInvoiceData({ ...invoiceData, companyLogo: null })}>
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Company Name</label>
                <Input value={invoiceData.companyName} onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">Email</label>
                  <Input value={invoiceData.companyEmail} onChange={(e) => setInvoiceData({ ...invoiceData, companyEmail: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">Phone</label>
                  <Input value={invoiceData.companyPhone} onChange={(e) => setInvoiceData({ ...invoiceData, companyPhone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Address</label>
                <Input value={invoiceData.companyAddress} onChange={(e) => setInvoiceData({ ...invoiceData, companyAddress: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <User className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">Bill To</h3>
            </div>
            
            {/* Client Selector */}
            <div className="relative mb-3">
              <label className="text-xs font-medium text-muted mb-1.5 block">Select Existing Client</label>
              <button
                onClick={() => setShowClientDropdown(!showClientDropdown)}
                className="w-full h-11 rounded-full border border-border bg-background px-4 text-sm text-left flex items-center justify-between"
              >
                <span className={invoiceData.clientName ? "" : "text-muted"}>
                  {invoiceData.clientName || "Choose a client..."}
                </span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
              {showClientDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 py-1 rounded-xl bg-card border border-border shadow-lg z-10 max-h-60 overflow-y-auto">
                  {clientsLoading ? (
                    <div className="px-4 py-3 text-sm text-muted text-center">Loading clients...</div>
                  ) : clients.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted text-center">No clients yet. Add one first.</div>
                  ) : (
                    clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => selectClient(client)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-secondary transition-colors"
                      >
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted">{client.email}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Client Name</label>
                <Input value={invoiceData.clientName} onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })} placeholder="Client name" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Email</label>
                <Input value={invoiceData.clientEmail} onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })} placeholder="client@email.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Address</label>
                <Input value={invoiceData.clientAddress} onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })} placeholder="Client address" />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">Invoice Details</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Invoice #</label>
                <Input value={invoiceData.invoiceNumber} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Date</label>
                <Input type="date" value={invoiceData.invoiceDate} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Due Date</label>
                <Input type="date" value={invoiceData.dueDate} onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })} />
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-4">
              <label className="text-xs font-medium text-muted mb-2 block">Line Items</label>
              <div className="space-y-2">
                {invoiceData.lineItems.map((item, index) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <Input placeholder="Description" value={item.description} onChange={(e) => updateLineItem(item.id, "description", e.target.value)} className="flex-1" />
                    <Input type="number" placeholder="Qty" value={item.quantity || ""} onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)} className="w-16" />
                    <Input type="number" placeholder="Rate" value={item.rate || ""} onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)} className="w-20" />
                    <span className="text-sm font-medium w-20 text-right">{formatCurrency(item.quantity * item.rate)}</span>
                    <button onClick={() => removeLineItem(item.id)} disabled={invoiceData.lineItems.length === 1} className="p-2 rounded-lg hover:bg-secondary text-muted hover:text-foreground disabled:opacity-30">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={addLineItem} className="mt-2">
                <Plus className="h-3 w-3 mr-1" /> Add Item
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Tax (%)</label>
                <Input type="number" value={invoiceData.tax || ""} onChange={(e) => setInvoiceData({ ...invoiceData, tax: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">Discount (%)</label>
                <Input type="number" value={invoiceData.discount || ""} onChange={(e) => setInvoiceData({ ...invoiceData, discount: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-5 rounded-2xl bg-card border border-border">
            <label className="text-xs font-medium text-muted mb-2 block">Notes / Payment Terms</label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              placeholder="Payment is due within 14 days..."
              className="w-full h-20 rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:border-primary/40 focus:outline-none"
            />
          </div>

          {/* Actions */}
          {saveError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              {saveError}
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => saveInvoice("draft")} disabled={isSaving || isSending}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => saveInvoice("sent")} disabled={isSaving || isSending}>
              {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className={cn("lg:col-span-3", activeTab === "details" && "hidden lg:block")}>
        <div className="sticky top-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Preview</h3>
            <Button variant="primary" size="sm" onClick={downloadPDF} disabled={isDownloading}>
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>
          </div>
          
          <div className="rounded-2xl border border-border overflow-hidden shadow-lg">
            <div ref={invoiceRef}>
              {/* Minimal Category */}
              {invoiceData.template === "minimal" && <MinimalTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "clean-slate" && <CleanSlateTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "nordic" && <NordicTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {/* Professional Category */}
              {invoiceData.template === "corporate" && <CorporateTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "executive" && <ExecutiveTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "consultant" && <ConsultantTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {/* Creative Category */}
              {invoiceData.template === "creative" && <CreativeTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "studio" && <StudioTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "neon" && <NeonTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {/* Modern Category */}
              {invoiceData.template === "startup" && <StartupTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "saas" && <SaasTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "fintech" && <FintechTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {/* Classic Category */}
              {invoiceData.template === "classic" && <ClassicTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "elegant" && <ElegantTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
              {invoiceData.template === "heritage" && <HeritageTemplate data={invoiceData} subtotal={subtotal} taxAmount={taxAmount} discountAmount={discountAmount} total={total} color={selectedTemplate.color} />}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 rounded-xl bg-secondary/50">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {invoiceData.tax > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Tax ({invoiceData.tax}%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            )}
            {invoiceData.discount > 0 && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Discount ({invoiceData.discount}%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TemplateProps {
  data: InvoiceData
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  color: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function MinimalTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-start mb-12">
        <div>
          {data.companyLogo ? (
            <img src={data.companyLogo} alt="Logo" className="w-12 h-12 object-contain mb-4" />
          ) : (
            <div className="w-10 h-10 rounded-xl mb-4" style={{ backgroundColor: color }} />
          )}
          <p className="font-semibold text-lg text-gray-900">{data.companyName || "Your Company"}</p>
          <p className="text-sm text-gray-500">{data.companyEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-light text-gray-900 mb-2">Invoice</p>
          <p className="text-sm text-gray-500">{data.invoiceNumber}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
          <p className="font-medium text-gray-900">{data.clientName || "Client Name"}</p>
          <p className="text-sm text-gray-500">{data.clientEmail}</p>
          <p className="text-sm text-gray-500">{data.clientAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Details</p>
          <p className="text-sm text-gray-700">Date: {formatDate(data.invoiceDate)}</p>
          <p className="text-sm text-gray-700">Due: {formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between py-4 border-b border-dashed border-gray-200">
            <div>
              <span className="text-gray-900">{item.description}</span>
              <span className="text-gray-400 text-sm ml-2">× {item.quantity}</span>
            </div>
            <span className="font-medium text-gray-900">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
        {data.lineItems.filter(item => item.description).length === 0 && (
          <div className="py-4 text-gray-400 text-center">No items added</div>
        )}
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">{formatCurrency(subtotal)}</span></div>
          {data.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({data.tax}%)</span><span className="text-gray-900">{formatCurrency(taxAmount)}</span></div>}
          {data.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount ({data.discount}%)</span><span className="text-gray-900">-{formatCurrency(discountAmount)}</span></div>}
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-500">Total</span>
            <span className="text-3xl font-semibold" style={{ color }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-12 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Notes</p>
          <p className="text-sm text-gray-600">{data.notes}</p>
        </div>
      )}
    </div>
  )
}

function CorporateTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-center pb-6 mb-8" style={{ borderBottom: `3px solid ${color}` }}>
        <div className="flex items-center gap-4">
          {data.companyLogo ? (
            <img src={data.companyLogo} alt="Logo" className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 rounded flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: color }}>
              {(data.companyName || "C").charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-xl text-gray-900">{data.companyName || "CORPORATE INC."}</p>
            <p className="text-xs text-gray-500">{data.companyEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl" style={{ color }}>INVOICE</p>
          <p className="text-sm text-gray-500">{data.invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-bold uppercase text-gray-400 mb-2">Billed To</p>
          <p className="font-semibold text-gray-900">{data.clientName || "Client Name"}</p>
          <p className="text-sm text-gray-500">{data.clientEmail}</p>
          <p className="text-sm text-gray-500">{data.clientAddress}</p>
        </div>
        <div className="text-right text-sm space-y-1">
          <p><span className="text-gray-400">Invoice Date:</span> <span className="text-gray-700">{formatDate(data.invoiceDate)}</span></p>
          <p><span className="text-gray-400">Due Date:</span> <span className="text-gray-700">{formatDate(data.dueDate)}</span></p>
          <p><span className="text-gray-400">Payment Terms:</span> <span className="text-gray-700">Net 14</span></p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr style={{ backgroundColor: color }} className="text-white text-sm">
            <th className="text-left p-3 rounded-l-lg">Description</th>
            <th className="text-right p-3">Qty</th>
            <th className="text-right p-3">Rate</th>
            <th className="text-right p-3 rounded-r-lg">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.filter(item => item.description).map((item, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="p-3 text-gray-900">{item.description}</td>
              <td className="p-3 text-right text-gray-700">{item.quantity}</td>
              <td className="p-3 text-right text-gray-700">{formatCurrency(item.rate)}</td>
              <td className="p-3 text-right font-medium text-gray-900">{formatCurrency(item.quantity * item.rate)}</td>
            </tr>
          ))}
          {data.lineItems.filter(item => item.description).length === 0 && (
            <tr><td colSpan={4} className="p-4 text-center text-gray-400">No items added</td></tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">{formatCurrency(subtotal)}</span></div>
          {data.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({data.tax}%)</span><span className="text-gray-900">{formatCurrency(taxAmount)}</span></div>}
          {data.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-gray-900">-{formatCurrency(discountAmount)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: `2px solid ${color}` }}>
            <span className="text-gray-900">Total Due</span><span style={{ color }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-8 pt-4 border-t border-gray-100 text-sm text-gray-500">{data.notes}</div>
      )}
    </div>
  )
}

function CreativeTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="grid grid-cols-3" style={{ minHeight: '700px' }}>
      <div className="col-span-1 p-8 text-white" style={{ backgroundColor: color }}>
        <div className="h-full flex flex-col justify-between">
          <div>
            <p className="text-3xl font-bold mb-2">INVOICE</p>
            <p className="text-white/60 text-sm">{data.invoiceNumber}</p>
          </div>
          <div>
            {data.companyLogo && <img src={data.companyLogo} alt="Logo" className="w-10 h-10 object-contain mb-3 rounded" />}
            <p className="text-xs uppercase tracking-wider text-white/60 mb-2">From</p>
            <p className="font-semibold">{data.companyName || "Creative Studio"}</p>
            <p className="text-sm text-white/70">{data.companyEmail}</p>
            <p className="text-sm text-white/70">{data.companyAddress}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 mb-2">Date</p>
            <p className="font-medium">{formatDate(data.invoiceDate)}</p>
            <p className="text-sm text-white/60">Due: {formatDate(data.dueDate)}</p>
          </div>
        </div>
      </div>
      <div className="col-span-2 p-8 bg-white">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Bill To</p>
          <p className="font-semibold text-lg text-gray-900">{data.clientName || "Client Company"}</p>
          <p className="text-sm text-gray-500">{data.clientEmail}</p>
          <p className="text-sm text-gray-500">{data.clientAddress}</p>
        </div>

        <div className="space-y-4 mb-8">
          {data.lineItems.filter(item => item.description).map((item, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100">
              <div>
                <span className="font-medium text-gray-900">{item.description}</span>
                <span className="text-gray-400 text-sm ml-2">× {item.quantity}</span>
              </div>
              <span className="text-lg text-gray-900">{formatCurrency(item.quantity * item.rate)}</span>
            </div>
          ))}
          {data.lineItems.filter(item => item.description).length === 0 && (
            <div className="py-4 text-gray-400 text-center">No items added</div>
          )}
        </div>

        <div className="flex justify-between items-end mt-auto">
          <div>
            {data.notes && <p className="text-xs text-gray-400 max-w-[200px]">{data.notes}</p>}
          </div>
          <div className="text-right">
            {data.tax > 0 && <p className="text-sm text-gray-500 mb-1">Tax: {formatCurrency(taxAmount)}</p>}
            {data.discount > 0 && <p className="text-sm text-gray-500 mb-1">Discount: -{formatCurrency(discountAmount)}</p>}
            <p className="text-sm text-gray-400">Total Amount</p>
            <p className="text-4xl font-bold" style={{ color }}>{formatCurrency(total)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ElegantTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="text-center mb-12 pb-8 border-b border-gray-200">
        {data.companyLogo ? (
          <img src={data.companyLogo} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
        ) : (
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-serif" style={{ backgroundColor: color }}>
            {(data.companyName || "E").charAt(0)}
          </div>
        )}
        <p className="text-2xl font-serif text-gray-900">{data.companyName || "Elegant & Co."}</p>
        <p className="text-sm text-gray-500">{data.companyEmail}</p>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-10 text-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Invoice</p>
          <p className="font-medium text-gray-900">{data.invoiceNumber}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Date</p>
          <p className="font-medium text-gray-900">{formatDate(data.invoiceDate)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Due</p>
          <p className="font-medium text-gray-900">{formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="mb-10 p-6 rounded-xl" style={{ backgroundColor: `${color}10` }}>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Prepared For</p>
        <p className="font-serif text-xl text-gray-900">{data.clientName || "Distinguished Client"}</p>
        <p className="text-sm text-gray-500">{data.clientEmail}</p>
        <p className="text-sm text-gray-500">{data.clientAddress}</p>
      </div>

      <div className="space-y-4 mb-10">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between py-4 border-b border-dashed border-gray-200">
            <span className="font-serif text-gray-900">{item.description} <span className="text-gray-400">× {item.quantity}</span></span>
            <span className="text-gray-900">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="text-center pt-6 border-t border-gray-200">
        {data.tax > 0 && <p className="text-sm text-gray-500 mb-1">Tax ({data.tax}%): {formatCurrency(taxAmount)}</p>}
        {data.discount > 0 && <p className="text-sm text-gray-500 mb-1">Discount: -{formatCurrency(discountAmount)}</p>}
        <p className="text-sm text-gray-400 mb-2">Total Amount Due</p>
        <p className="text-5xl font-serif" style={{ color }}>{formatCurrency(total)}</p>
      </div>

      {data.notes && (
        <div className="mt-8 text-center text-sm text-gray-400">{data.notes}</div>
      )}
    </div>
  )
}

function StartupTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-[#0F0F10] text-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-3">
          {data.companyLogo ? (
            <img src={data.companyLogo} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: color }}>
              {(data.companyName || "S").charAt(0)}
            </div>
          )}
          <span className="font-semibold text-lg">{data.companyName || "Startup.io"}</span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Invoice</p>
          <p className="font-mono">{data.invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">To</p>
          <p className="font-medium">{data.clientName || "Tech Company Inc."}</p>
          <p className="text-sm text-gray-400">{data.clientEmail}</p>
          <p className="text-sm text-gray-400">{data.clientAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase mb-2">Issued</p>
          <p className="font-medium">{formatDate(data.invoiceDate)}</p>
          <p className="text-sm text-gray-400">Due: {formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-3 mb-10">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">{item.description}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <span className="font-mono">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
        {data.lineItems.filter(item => item.description).length === 0 && (
          <div className="p-4 rounded-xl bg-white/5 text-center text-gray-500">No items added</div>
        )}
      </div>

      <div className="space-y-2 mb-6">
        {data.tax > 0 && (
          <div className="flex justify-between text-sm text-gray-400">
            <span>Tax ({data.tax}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
        )}
        {data.discount > 0 && (
          <div className="flex justify-between text-sm text-gray-400">
            <span>Discount ({data.discount}%)</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center p-6 rounded-xl" style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
        <span className="text-gray-400">Total</span>
        <span className="text-3xl font-bold" style={{ color }}>{formatCurrency(total)}</span>
      </div>

      {data.notes && (
        <div className="mt-6 text-sm text-gray-500">{data.notes}</div>
      )}
    </div>
  )
}

function ClassicTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-start mb-8 pb-6" style={{ borderBottom: `4px double ${color}` }}>
        <div>
          <p className="text-3xl font-bold" style={{ color }}>INVOICE</p>
          <p className="text-sm text-gray-500 mt-1">{data.companyName || "Classic Business Services"}</p>
        </div>
        <div className="text-right">
          {data.companyLogo && <img src={data.companyLogo} alt="Logo" className="w-12 h-12 object-contain ml-auto mb-2" />}
          <p className="font-bold text-gray-900">Invoice No: {data.invoiceNumber}</p>
          <p className="text-sm text-gray-500">Date: {formatDate(data.invoiceDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="font-bold mb-2" style={{ color }}>FROM:</p>
          <p className="font-semibold text-gray-900">{data.companyName || "Classic Business Co."}</p>
          <p className="text-sm text-gray-500">{data.companyEmail}</p>
          <p className="text-sm text-gray-500">{data.companyAddress}</p>
        </div>
        <div>
          <p className="font-bold mb-2" style={{ color }}>TO:</p>
          <p className="font-semibold text-gray-900">{data.clientName || "Client Corporation"}</p>
          <p className="text-sm text-gray-500">{data.clientEmail}</p>
          <p className="text-sm text-gray-500">{data.clientAddress}</p>
        </div>
      </div>

      <table className="w-full mb-8 text-sm">
        <thead>
          <tr className="border-y-2" style={{ borderColor: color }}>
            <th className="text-left py-3 text-gray-900">Description</th>
            <th className="text-right py-3 text-gray-900">Qty</th>
            <th className="text-right py-3 text-gray-900">Rate</th>
            <th className="text-right py-3 text-gray-900">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.filter(item => item.description).map((item, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-3 text-gray-900">{item.description}</td>
              <td className="py-3 text-right text-gray-700">{item.quantity}</td>
              <td className="py-3 text-right text-gray-700">{formatCurrency(item.rate)}</td>
              <td className="py-3 text-right text-gray-900">{formatCurrency(item.quantity * item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-56">
          <div className="flex justify-between py-2 text-gray-700"><span>Subtotal:</span><span>{formatCurrency(subtotal)}</span></div>
          {data.tax > 0 && <div className="flex justify-between py-2 text-gray-700"><span>Tax ({data.tax}%):</span><span>{formatCurrency(taxAmount)}</span></div>}
          {data.discount > 0 && <div className="flex justify-between py-2 text-gray-700"><span>Discount:</span><span>-{formatCurrency(discountAmount)}</span></div>}
          <div className="flex justify-between py-3 font-bold text-lg border-t-2" style={{ borderColor: color }}>
            <span className="text-gray-900">TOTAL:</span><span style={{ color }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        {data.notes || "Payment due within 14 days. Thank you for your business."}
      </div>
    </div>
  )
}

function CleanSlateTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-start mb-16">
        <div>
          {data.companyLogo ? (
            <img src={data.companyLogo} alt="Logo" className="w-10 h-10 object-contain mb-3" />
          ) : (
            <div className="w-8 h-8 rounded mb-3" style={{ backgroundColor: color }} />
          )}
          <p className="text-sm text-gray-500">{data.companyName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Invoice</p>
          <p className="text-sm text-gray-700">{data.invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16 mb-12">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Billed To</p>
          <p className="text-gray-900">{data.clientName || "Client"}</p>
          <p className="text-sm text-gray-500">{data.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Date</p>
          <p className="text-sm text-gray-700">{formatDate(data.invoiceDate)}</p>
          <p className="text-sm text-gray-500">Due: {formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-700">{item.description} × {item.quantity}</span>
            <span className="text-gray-900">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex justify-end">
          <div className="w-48 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            {data.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>{formatCurrency(taxAmount)}</span></div>}
            {data.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span>-{formatCurrency(discountAmount)}</span></div>}
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-700">Total</span>
              <span className="text-xl font-medium" style={{ color }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {data.notes && <p className="mt-12 text-xs text-gray-400">{data.notes}</p>}
    </div>
  )
}

function NordicTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-[#FAFAFA]" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-center mb-12">
        <p className="text-2xl font-light text-gray-800">{data.companyName || "Nordic Studio"}</p>
        <p className="text-sm text-gray-400">{data.invoiceNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2">Client</p>
          <p className="text-gray-800">{data.clientName}</p>
          <p className="text-sm text-gray-500">{data.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2">Date</p>
          <p className="text-gray-800">{formatDate(data.invoiceDate)}</p>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-700">{item.description}</span>
            <span className="text-gray-800">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2">Total</p>
          <p className="text-3xl font-light" style={{ color }}>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  )
}

function ExecutiveTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="border-b-2 border-gray-900 pb-6 mb-8">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-gray-900">{data.companyName || "Executive Corp"}</p>
            <p className="text-sm text-gray-500">{data.companyEmail} | {data.companyPhone}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color }}>INVOICE</p>
            <p className="text-sm text-gray-500">{data.invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-xs font-bold text-gray-400 mb-2">BILL TO</p>
          <p className="font-semibold text-gray-900">{data.clientName}</p>
          <p className="text-sm text-gray-600">{data.clientEmail}</p>
          <p className="text-sm text-gray-600">{data.clientAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-sm"><span className="text-gray-500">Date:</span> {formatDate(data.invoiceDate)}</p>
          <p className="text-sm"><span className="text-gray-500">Due:</span> {formatDate(data.dueDate)}</p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-900 text-white text-sm">
            <th className="text-left p-3">Description</th>
            <th className="text-right p-3">Qty</th>
            <th className="text-right p-3">Rate</th>
            <th className="text-right p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.filter(item => item.description).map((item, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="p-3">{item.description}</td>
              <td className="p-3 text-right">{item.quantity}</td>
              <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
              <td className="p-3 text-right font-medium">{formatCurrency(item.quantity * item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          {data.tax > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(taxAmount)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-gray-900">
            <span>Total</span><span style={{ color }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConsultantTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-1">Invoice {data.invoiceNumber}</p>
        <p className="text-xl font-semibold text-gray-900">{data.companyName || "Consulting Services"}</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-400 mb-1">Client</p>
          <p className="font-medium text-gray-900">{data.clientName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Issue Date</p>
          <p className="text-gray-700">{formatDate(data.invoiceDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Due Date</p>
          <p className="text-gray-700">{formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-3 mb-10">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{item.description}</p>
              <p className="text-sm text-gray-500">{item.quantity} × {formatCurrency(item.rate)}</p>
            </div>
            <span className="font-semibold">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-64 p-4 rounded-lg" style={{ backgroundColor: `${color}10` }}>
          <div className="flex justify-between mb-2"><span className="text-gray-600">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          {data.tax > 0 && <div className="flex justify-between mb-2"><span className="text-gray-600">Tax</span><span>{formatCurrency(taxAmount)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ borderColor: color }}>
            <span>Total</span><span style={{ color }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StudioTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-gray-900 text-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-start mb-12">
        <div>
          <p className="text-3xl font-bold mb-2" style={{ color }}>{data.companyName || "STUDIO"}</p>
          <p className="text-sm text-gray-400">{data.companyEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Invoice</p>
          <p className="text-lg">{data.invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-xs text-gray-500 uppercase mb-2">Client</p>
          <p className="font-medium">{data.clientName}</p>
          <p className="text-sm text-gray-400">{data.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase mb-2">Date</p>
          <p>{formatDate(data.invoiceDate)}</p>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between py-4 border-b border-gray-800">
            <span>{item.description}</span>
            <span style={{ color }}>{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-4xl font-bold" style={{ color }}>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  )
}

function NeonTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-black text-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-start mb-12">
        <div>
          <p className="text-4xl font-black" style={{ color, textShadow: `0 0 20px ${color}` }}>INVOICE</p>
          <p className="text-sm text-gray-500 mt-2">{data.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{data.companyName}</p>
          <p className="text-sm text-gray-500">{data.companyEmail}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 p-4 rounded-lg" style={{ border: `1px solid ${color}30` }}>
        <div>
          <p className="text-xs uppercase mb-2" style={{ color }}>Bill To</p>
          <p className="font-medium">{data.clientName}</p>
          <p className="text-sm text-gray-400">{data.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase mb-2" style={{ color }}>Due</p>
          <p>{formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-3 mb-10">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between p-4 rounded" style={{ backgroundColor: `${color}10` }}>
            <span>{item.description}</span>
            <span className="font-mono">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="p-6 rounded-lg text-center" style={{ backgroundColor: `${color}20`, boxShadow: `0 0 30px ${color}30` }}>
          <p className="text-sm text-gray-400 mb-2">Total Due</p>
          <p className="text-4xl font-black" style={{ color }}>{formatCurrency(total)}</p>
        </div>
      </div>
    </div>
  )
}

function SaasTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: color }}>
            {(data.companyName || "S").charAt(0)}
          </div>
          <span className="font-semibold text-lg">{data.companyName}</span>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${color}15`, color }}>
          {data.invoiceNumber}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs text-gray-400 uppercase mb-2">Billed To</p>
          <p className="font-medium">{data.clientName}</p>
          <p className="text-sm text-gray-500">{data.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase mb-2">Invoice Date</p>
          <p>{formatDate(data.invoiceDate)}</p>
          <p className="text-sm text-gray-500">Due: {formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 overflow-hidden mb-8">
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 text-xs font-medium text-gray-500 uppercase">
          <span className="col-span-2">Item</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Amount</span>
        </div>
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100">
            <span className="col-span-2 font-medium">{item.description}</span>
            <span className="text-right text-gray-500">{item.quantity}</span>
            <span className="text-right">{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          {data.tax > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span>{formatCurrency(taxAmount)}</span></div>}
          <div className="flex justify-between font-semibold text-lg pt-3 border-t">
            <span>Total</span><span style={{ color }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FintechTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white" style={{ minHeight: '700px' }}>
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-2xl font-bold">{data.companyName || "FinTech"}</p>
          <p className="text-sm text-gray-400">{data.companyEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase">Invoice</p>
          <p className="font-mono text-lg">{data.invoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 p-4 rounded-xl bg-white/5">
        <div>
          <p className="text-xs text-gray-500 mb-1">Client</p>
          <p className="font-medium">{data.clientName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Due Date</p>
          <p>{formatDate(data.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        {data.lineItems.filter(item => item.description).map((item, i) => (
          <div key={i} className="flex justify-between p-4 rounded-lg bg-white/5">
            <span>{item.description}</span>
            <span className="font-mono" style={{ color }}>{formatCurrency(item.quantity * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl" style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Amount</span>
          <span className="text-3xl font-bold" style={{ color }}>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}

function HeritageTemplate({ data, subtotal, taxAmount, discountAmount, total, color }: TemplateProps) {
  return (
    <div className="p-10 bg-[#FDF8F3]" style={{ minHeight: '700px' }}>
      <div className="text-center mb-10 pb-6" style={{ borderBottom: `2px solid ${color}` }}>
        <p className="text-3xl font-serif" style={{ color }}>{data.companyName || "Heritage & Sons"}</p>
        <p className="text-sm text-gray-500 mt-2">{data.companyEmail} • {data.companyPhone}</p>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Invoice To</p>
          <p className="font-serif text-lg" style={{ color }}>{data.clientName}</p>
          <p className="text-sm text-gray-600">{data.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Invoice Details</p>
          <p className="text-sm">No: {data.invoiceNumber}</p>
          <p className="text-sm">Date: {formatDate(data.invoiceDate)}</p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr style={{ borderTop: `1px solid ${color}`, borderBottom: `1px solid ${color}` }}>
            <th className="text-left py-3 font-serif">Description</th>
            <th className="text-right py-3 font-serif">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.filter(item => item.description).map((item, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-3">{item.description} × {item.quantity}</td>
              <td className="py-3 text-right">{formatCurrency(item.quantity * item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-56">
          <div className="flex justify-between py-2"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          {data.tax > 0 && <div className="flex justify-between py-2"><span>Tax</span><span>{formatCurrency(taxAmount)}</span></div>}
          <div className="flex justify-between py-3 font-serif text-xl" style={{ borderTop: `2px solid ${color}` }}>
            <span>Total</span><span style={{ color }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {data.notes && <p className="mt-8 text-center text-sm text-gray-500 italic">{data.notes}</p>}
    </div>
  )
}
