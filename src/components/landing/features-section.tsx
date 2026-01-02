"use client"

import * as React from "react"
import { FileText, Users, CreditCard, BarChart3, Globe, Clock, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: FileText,
    title: "AI Invoice Generation",
    description: "Describe what you need in plain English. Our AI creates professional invoices instantly.",
    size: "large",
  },
  {
    icon: Users,
    title: "Client Hub",
    description: "All your relationships, organized.",
    size: "small",
  },
  {
    icon: CreditCard,
    title: "Smart Payments",
    description: "Automated reminders & tracking.",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description: "Real-time insights into your cash flow, revenue trends, and business health.",
    size: "medium",
  },
  {
    icon: Globe,
    title: "100+ Currencies",
    description: "Go global with multi-currency support.",
    size: "small",
  },
  {
    icon: Clock,
    title: "Time to Invoice",
    description: "Track hours, convert to invoices.",
    size: "small",
  },
]

export function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              Everything you need
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Powerful tools designed for modern businesses
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {/* Large Card - AI Generation */}
          <ScrollReveal delay={0} className="md:col-span-2 md:row-span-2">
            <div
              className={cn(
                "group relative h-full p-8 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden",
                "bg-primary text-white"
              )}
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 dot-pattern opacity-20" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
              
              <div className="relative h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{features[0].title}</h3>
                <p className="text-white/70 leading-relaxed flex-1">{features[0].description}</p>
                <div className="flex items-center gap-2 text-sm font-medium mt-4 group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Small Cards - Row 1 */}
          {features.slice(1, 3).map((feature, idx) => (
            <ScrollReveal key={feature.title} delay={(idx + 1) * 100}>
              <div
                className={cn(
                  "group relative h-full p-6 rounded-[2rem] transition-all duration-500 cursor-pointer",
                  "bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                )}
                onMouseEnter={() => setHoveredIndex(idx + 1)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                  hoveredIndex === idx + 1 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}

          {/* Medium Card - Analytics */}
          <ScrollReveal delay={300} className="md:col-span-2">
            <div
              className={cn(
                "group relative h-full p-6 rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden",
                "bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              )}
              onMouseEnter={() => setHoveredIndex(3)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Mini chart visualization */}
              <div className="absolute right-6 bottom-6 flex items-end gap-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="w-3 rounded-full bg-primary" style={{ height: `${h}px` }} />
                ))}
              </div>
              
              <div className="relative">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                  hoveredIndex === 3 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{features[3].title}</h3>
                <p className="text-sm text-muted max-w-xs">{features[3].description}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Small Cards - Row 2 */}
          {features.slice(4).map((feature, idx) => (
            <ScrollReveal key={feature.title} delay={(idx + 4) * 100}>
              <div
                className={cn(
                  "group relative h-full p-6 rounded-[2rem] transition-all duration-500 cursor-pointer",
                  "bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                )}
                onMouseEnter={() => setHoveredIndex(idx + 4)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                  hoveredIndex === idx + 4 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
