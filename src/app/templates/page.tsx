"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Star, ArrowRight, Eye, Check, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { templates, categories, Template } from "@/lib/templates"
import { TemplateThumbnail } from "@/components/ui/template-thumbnail"
import { cn } from "@/lib/utils"

export default function PublicTemplatesPage() {
  const [search, setSearch] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [previewTemplate, setPreviewTemplate] = React.useState<Template | null>(null)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularTemplates = templates.filter(t => t.popular)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Button variant="primary" size="sm" asChild>
              <Link href="/auth">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">Templates</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Professional Invoice Templates
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Choose from {templates.length} beautifully designed templates. Customize colors, add your logo, and start invoicing in minutes.
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted">{filteredTemplates.length} templates</p>
        </div>

        {/* Popular Templates */}
        {selectedCategory === "all" && !search && (
          <div className="p-6 rounded-2xl bg-card border border-border mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <h2 className="font-semibold">Most Popular</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularTemplates.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onPreview={() => setPreviewTemplate(template)}
                  compact 
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              {category.name}
              <span className={cn(
                "ml-2 text-xs",
                selectedCategory === category.id ? "text-white/70" : "text-muted"
              )}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => (
            <TemplateCard 
              key={template.id} 
              template={template}
              onPreview={() => setPreviewTemplate(template)}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-medium mb-1">No templates found</p>
            <p className="text-sm text-muted">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center p-10 rounded-2xl bg-primary/5">
          <h2 className="text-2xl font-semibold mb-3">Ready to create your first invoice?</h2>
          <p className="text-muted mb-6">Sign up free and start using any template in seconds.</p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/auth">
              Get Started Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
        />
      )}
    </div>
  )
}

function TemplateCard({ 
  template, 
  onPreview,
  compact = false 
}: { 
  template: Template
  onPreview: () => void
  compact?: boolean 
}) {
  return (
    <div className={cn(
      "group rounded-2xl bg-card border border-border overflow-hidden transition-all duration-200 hover:border-primary/30",
      compact ? "" : "hover:shadow-lg"
    )}>
      {/* Preview */}
      <div 
        className={cn(
          "relative overflow-hidden flex items-center justify-center p-3",
          compact ? "h-36" : "h-52"
        )}
        style={{ backgroundColor: `${template.color}08` }}
      >
        {/* Real Template Thumbnail */}
        <TemplateThumbnail 
          template={template} 
          className={cn(
            "w-full max-w-[140px] shadow-md",
            compact && "max-w-[100px]"
          )} 
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {template.popular && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-medium">
              Popular
            </span>
          )}
          {template.new && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-medium">
              New
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onPreview}
            className="px-3 py-1.5 rounded-full bg-white text-gray-900 text-xs font-medium flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
          <Link
            href="/auth"
            className="px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: template.color }}
          >
            Use Template
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={cn("font-semibold", compact && "text-sm")}>{template.name}</h3>
            <p className={cn("text-muted", compact ? "text-xs" : "text-sm")}>{template.description}</p>
          </div>
          <div 
            className={cn("rounded-lg flex-shrink-0", compact ? "w-5 h-5" : "w-6 h-6")}
            style={{ backgroundColor: template.color }}
          />
        </div>
      </div>
    </div>
  )
}

function TemplatePreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: template.color }}>
              {template.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-lg">{template.name}</h2>
              <p className="text-sm text-muted">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/auth">
                Use Template
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-secondary/30">
          <div className="max-w-2xl mx-auto">
            <InvoicePreview template={template} />
          </div>
        </div>

        <div className="p-5 border-t border-border bg-card">
          <div className="flex flex-wrap gap-4 justify-center">
            {["Customizable colors", "Add your logo", "Multiple currencies", "Auto calculations", "PDF export"].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-muted">
                <Check className="h-4 w-4 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InvoicePreview({ template }: { template: Template }) {
  const color = template.color

  if (template.category === "minimal") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8" style={{ minHeight: '500px' }}>
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="w-10 h-10 rounded-lg mb-4" style={{ backgroundColor: color }} />
            <p className="font-semibold text-lg text-gray-900">Your Company</p>
            <p className="text-sm text-gray-500">hello@company.com</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light text-gray-900 mb-1">Invoice</p>
            <p className="text-sm text-gray-400">#INV-001</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
            <p className="font-medium text-gray-900">Client Name</p>
            <p className="text-sm text-gray-500">client@email.com</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Details</p>
            <p className="text-sm text-gray-700">Date: Jan 2, 2026</p>
            <p className="text-sm text-gray-700">Due: Jan 16, 2026</p>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          {["Design Services", "Development", "Consulting"].map((item, i) => (
            <div key={i} className="flex justify-between py-3 border-b border-dashed border-gray-200">
              <span className="text-gray-900">{item}</span>
              <span className="font-medium text-gray-900">${(2500 + i * 1500).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Total</p>
            <p className="text-3xl font-semibold" style={{ color }}>$8,000</p>
          </div>
        </div>
      </div>
    )
  }

  if (template.category === "professional") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8" style={{ minHeight: '500px' }}>
        <div className="flex justify-between items-center pb-5 mb-6" style={{ borderBottom: `3px solid ${color}` }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: color }}>C</div>
            <div>
              <p className="font-bold text-xl text-gray-900">COMPANY NAME</p>
              <p className="text-xs text-gray-500">Professional Services</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl" style={{ color }}>INVOICE</p>
            <p className="text-sm text-gray-500">#PRO-2026-001</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-bold uppercase text-gray-400 mb-2">Billed To</p>
            <p className="font-semibold text-gray-900">Acme Corporation</p>
            <p className="text-sm text-gray-500">123 Business Ave, New York</p>
          </div>
          <div className="text-right text-sm space-y-1">
            <p><span className="text-gray-400">Invoice Date:</span> <span className="text-gray-700">January 2, 2026</span></p>
            <p><span className="text-gray-400">Due Date:</span> <span className="text-gray-700">January 16, 2026</span></p>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr style={{ backgroundColor: color }} className="text-white text-sm">
              <th className="text-left p-3 rounded-l-lg">Description</th>
              <th className="text-right p-3">Qty</th>
              <th className="text-right p-3">Rate</th>
              <th className="text-right p-3 rounded-r-lg">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[{ d: "Consulting", q: 20, r: 250 }, { d: "Analysis", q: 1, r: 3500 }].map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="p-3 text-gray-900">{row.d}</td>
                <td className="p-3 text-right text-gray-700">{row.q}</td>
                <td className="p-3 text-right text-gray-700">${row.r}</td>
                <td className="p-3 text-right font-medium text-gray-900">${(row.q * row.r).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-48 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>$8,500</span></div>
            <div className="flex justify-between font-bold pt-2" style={{ borderTop: `2px solid ${color}` }}>
              <span>Total</span><span style={{ color }}>$8,500</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (template.category === "creative") {
    return (
      <div className="rounded-xl shadow-lg overflow-hidden" style={{ minHeight: '500px' }}>
        <div className="grid grid-cols-3">
          <div className="col-span-1 p-6 text-white" style={{ backgroundColor: color }}>
            <div className="h-full flex flex-col justify-between" style={{ minHeight: '400px' }}>
              <div>
                <p className="text-2xl font-bold mb-1">INVOICE</p>
                <p className="text-white/60 text-sm">#CRE-001</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60 mb-2">From</p>
                <p className="font-semibold">Creative Studio</p>
                <p className="text-sm text-white/70">hello@creative.co</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/60 mb-2">Date</p>
                <p className="font-medium">Jan 2, 2026</p>
              </div>
            </div>
          </div>
          <div className="col-span-2 p-6 bg-white">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Bill To</p>
              <p className="font-semibold text-lg text-gray-900">Client Company</p>
            </div>
            <div className="space-y-3 mb-6">
              {["Brand Design", "Website UI"].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-900">{item}</span>
                  <span className="text-lg text-gray-900">${(5000 + i * 3000).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-3xl font-bold" style={{ color }}>$8,000</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (template.category === "modern") {
    return (
      <div className="bg-[#0F0F10] text-white rounded-xl shadow-lg p-8" style={{ minHeight: '500px' }}>
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: color }}>S</div>
            <span className="font-semibold text-lg">Startup.io</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Invoice</p>
            <p className="font-mono">#SU-2026-001</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {[{ item: "SaaS License", amount: 9600 }, { item: "API Access", amount: 2400 }].map((row, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5">
              <p className="font-medium">{row.item}</p>
              <span className="font-mono">${row.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center p-5 rounded-xl" style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
          <span className="text-gray-400">Total</span>
          <span className="text-2xl font-bold" style={{ color }}>$12,000</span>
        </div>
      </div>
    )
  }

  // Classic
  return (
    <div className="bg-white rounded-xl shadow-lg p-8" style={{ minHeight: '500px' }}>
      <div className="flex justify-between items-start mb-6 pb-5" style={{ borderBottom: `4px double ${color}` }}>
        <div>
          <p className="text-2xl font-bold" style={{ color }}>INVOICE</p>
          <p className="text-sm text-gray-500 mt-1">Classic Business</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">Invoice No: #CLB-001</p>
          <p className="text-sm text-gray-500">Date: January 2, 2026</p>
        </div>
      </div>

      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className="border-y-2" style={{ borderColor: color }}>
            <th className="text-left py-3">Description</th>
            <th className="text-right py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {["Professional Services", "Project Management"].map((item, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-3 text-gray-900">{item}</td>
              <td className="py-3 text-right text-gray-900">${(5000 + i * 2000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-48">
          <div className="flex justify-between py-3 font-bold text-lg border-t-2" style={{ borderColor: color }}>
            <span>TOTAL:</span><span style={{ color }}>$7,000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
