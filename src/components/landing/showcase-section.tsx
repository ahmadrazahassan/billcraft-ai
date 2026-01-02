"use client"

import * as React from "react"
import { FileText, Users, BarChart3, ArrowRight, Check } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { cn } from "@/lib/utils"

const showcases = [
  {
    id: "invoicing",
    icon: FileText,
    title: "Smart Invoicing",
    description: "Create and send professional invoices in seconds with AI assistance",
    features: ["AI-powered generation", "Custom branding", "Recurring invoices"],
  },
  {
    id: "clients",
    icon: Users,
    title: "Client Portal",
    description: "Manage all your clients and their payment history in one place",
    features: ["Contact management", "Payment history", "Communication logs"],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Revenue Insights",
    description: "Track your business performance with beautiful analytics",
    features: ["Revenue trends", "Cash flow forecast", "Client insights"],
  },
]

// Mockup client avatars
const clientAvatars = [
  { initials: "AC", color: "bg-violet-500", name: "Acme Corp" },
  { initials: "TS", color: "bg-blue-500", name: "Tech Solutions" },
  { initials: "DS", color: "bg-pink-500", name: "Design Studio" },
]

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = React.useState("invoicing")

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">How it works</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 tracking-tight">
              Powerful & simple
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Everything you need to manage your invoicing workflow
            </p>
          </div>
        </ScrollReveal>

        {/* Tab Navigation */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {showcases.map((showcase) => (
              <button
                key={showcase.id}
                onClick={() => setActiveTab(showcase.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300",
                  activeTab === showcase.id
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-card hover:bg-secondary"
                )}
              >
                <showcase.icon className="h-4 w-4" />
                {showcase.title}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {showcases.map((showcase) => (
            activeTab === showcase.id && (
              <React.Fragment key={showcase.id}>
                {/* Info */}
                <ScrollReveal delay={200}>
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      <showcase.icon className="h-7 w-7" />
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl font-semibold mb-4">
                      {showcase.title}
                    </h3>
                    
                    <p className="text-muted text-lg mb-8 leading-relaxed">
                      {showcase.description}
                    </p>
                    
                    <ul className="space-y-4 mb-8">
                      {showcase.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3.5 w-3.5 text-success" />
                          </div>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </ScrollReveal>

                {/* Preview */}
                <ScrollReveal delay={300}>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
                    <div className="relative bg-card rounded-3xl p-6 shadow-xl">
                      {showcase.id === "invoicing" && <InvoicingPreview />}
                      {showcase.id === "clients" && <ClientsPreview />}
                      {showcase.id === "analytics" && <AnalyticsPreview />}
                    </div>
                  </div>
                </ScrollReveal>
              </React.Fragment>
            )
          ))}
        </div>
      </div>
    </section>
  )
}

function InvoicingPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-sm font-semibold">AI</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Web design project - $2,500</p>
          <p className="text-xs text-muted">Generating invoice...</p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-secondary/50">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Invoice #001</span>
          <span className="text-primary font-bold">$2,500</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>Web Design Services</span>
            <span>$2,500</span>
          </div>
          <div className="pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>$2,500</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClientsPreview() {
  const clients = [
    { name: "Acme Corp", email: "billing@acme.com", amount: "$12,500", initials: "AC", color: "bg-violet-500" },
    { name: "Tech Solutions", email: "pay@techsol.io", amount: "$8,400", initials: "TS", color: "bg-blue-500" },
    { name: "Design Studio", email: "hello@design.co", amount: "$5,600", initials: "DS", color: "bg-pink-500" },
  ]
  
  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <div key={client.name} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm", client.color)}>
            {client.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{client.name}</p>
            <p className="text-xs text-muted truncate">{client.email}</p>
          </div>
          <span className="text-sm font-semibold">{client.amount}</span>
        </div>
      ))}
    </div>
  )
}

function AnalyticsPreview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-secondary/50">
          <p className="text-xs text-muted mb-1">Revenue</p>
          <p className="text-xl font-bold">$52,450</p>
          <p className="text-xs text-success">+12.5%</p>
        </div>
        <div className="p-4 rounded-2xl bg-secondary/50">
          <p className="text-xs text-muted mb-1">Clients</p>
          <p className="text-xl font-bold">24</p>
          <p className="text-xs text-success">+3 new</p>
        </div>
      </div>
      <div className="h-28 rounded-2xl bg-secondary/30 flex items-end p-4 gap-1.5">
        {[35, 55, 40, 70, 50, 85, 60].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-primary/40 rounded-lg hover:bg-primary/60 transition-colors"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}
