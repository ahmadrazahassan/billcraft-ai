"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Button } from "@/components/ui/button"
import { templates as invoiceTemplates } from "@/lib/templates"
import { cn } from "@/lib/utils"

export function TemplatesSection() {
  const [selectedTemplate, setSelectedTemplate] = React.useState("minimal")
  const selectedTemplateData = invoiceTemplates.find(t => t.id === selectedTemplate) || invoiceTemplates[0]

  // Show first 6 templates for landing page
  const displayTemplates = invoiceTemplates.slice(0, 6)

  return (
    <section id="templates" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-sm font-medium text-primary">Templates</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Pick your style
              </h2>
            </div>
            <p className="text-muted text-lg max-w-md lg:text-right">
              Professional invoice templates for every business type
            </p>
          </div>
        </ScrollReveal>

        {/* Template Grid Selector */}
        <ScrollReveal delay={100}>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
            {displayTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  "p-4 rounded-2xl text-center transition-all duration-300",
                  selectedTemplate === template.id
                    ? "bg-foreground text-background shadow-lg"
                    : "bg-card hover:shadow-md"
                )}
              >
                <div 
                  className="w-8 h-8 rounded-lg mx-auto mb-3"
                  style={{ backgroundColor: template.color }}
                />
                <p className="font-medium text-sm">{template.name}</p>
                <p className={cn(
                  "text-xs",
                  selectedTemplate === template.id ? "text-background/60" : "text-muted"
                )}>
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Invoice Preview */}
        <ScrollReveal delay={200}>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl" />
            <div className="relative bg-white dark:bg-card rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden max-w-2xl mx-auto">
              <LandingTemplatePreview template={selectedTemplateData} />
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Button variant="primary" size="lg" className="gap-2" asChild>
              <Link href="/auth">
                Start with this template
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted">{invoiceTemplates.length} templates available</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function LandingTemplatePreview({ template }: { template: typeof invoiceTemplates[0] }) {
  const color = template.color
  const isStartup = template.id === 'startup'
  const bgColor = isStartup ? '#0F0F10' : '#ffffff'
  const textColor = isStartup ? '#ffffff' : '#1a1a1a'
  const mutedColor = isStartup ? '#888888' : '#888888'
  
  return (
    <div className="p-10" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <div className="w-10 h-10 rounded-xl mb-4" style={{ backgroundColor: color }} />
          <p className="font-semibold text-lg" style={{ color: textColor }}>Your Company</p>
          <p className="text-sm" style={{ color: mutedColor }}>hello@company.com</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-light mb-2" style={{ color: textColor }}>Invoice</p>
          <p className="text-sm" style={{ color: mutedColor }}>#INV-001</p>
        </div>
      </div>
      
      {/* Bill To */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: mutedColor }}>Bill To</p>
          <p className="font-medium" style={{ color: textColor }}>Client Name</p>
          <p className="text-sm" style={{ color: mutedColor }}>client@email.com</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: mutedColor }}>Details</p>
          <p className="text-sm" style={{ color: textColor }}>Date: Jan 2, 2026</p>
          <p className="text-sm" style={{ color: textColor }}>Due: Jan 16, 2026</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4 mb-12">
        {[
          { item: "Design Services", amount: 2500 },
          { item: "Development", amount: 4000 },
          { item: "Consulting", amount: 1500 },
        ].map((row, i) => (
          <div 
            key={i} 
            className="flex justify-between py-4"
            style={{ borderBottom: `1px dashed ${isStartup ? '#333' : '#e5e5e5'}` }}
          >
            <span style={{ color: textColor }}>{row.item}</span>
            <span className="font-medium" style={{ color: textColor }}>${row.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="text-right">
          <p className="text-sm mb-1" style={{ color: mutedColor }}>Total</p>
          <p className="text-4xl font-semibold" style={{ color: color }}>$8,000</p>
        </div>
      </div>
    </div>
  )
}
