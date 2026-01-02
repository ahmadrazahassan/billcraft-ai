"use client"

import Link from "next/link"
import { ArrowUpRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedText, CountUp } from "@/components/ui/animated-text"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { cn } from "@/lib/utils"

const stats = [
  { value: 10000, suffix: "+", label: "Users" },
  { value: 50, prefix: "$", suffix: "M", label: "Invoiced" },
  { value: 99, suffix: "%", label: "Uptime" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[5%] w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute top-[30%] right-[0%] w-[500px] h-[500px] rounded-full bg-primary-light/[0.05] blur-3xl" />
        <div className="absolute bottom-[5%] left-[25%] w-[400px] h-[400px] rounded-full bg-primary/[0.02] blur-2xl" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 mb-10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Invoice Platform</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-8 leading-[1.05]">
              <span className="block mb-2">Beautiful</span>
              <AnimatedText words={["Invoicing", "Billing", "Payments"]} interval={2500} />
              <span className="block mt-2">Made Simple</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
              Create stunning invoices in seconds. Manage clients effortlessly. Get paid faster with the power of AI.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="gap-2 min-w-[200px]">
                  Start for Free
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="lg" className="gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-4 w-4 fill-primary text-primary ml-0.5" />
                </div>
                Watch Demo
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl sm:text-5xl font-semibold mb-2">
                    <span className="text-primary">
                      {stat.prefix}
                      <CountUp end={stat.value} duration={2000} />
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={500} direction="scale">
          <div className="mt-24 relative">
            <div className="absolute -inset-8 bg-primary/5 rounded-[3rem] blur-3xl" />
            <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-2 px-5 py-4 bg-secondary/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-full bg-background text-xs text-muted">app.billcraft.io</div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 bg-card">
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Revenue", value: "$52,450", change: "+12%", color: "text-success" },
                    { label: "Invoices", value: "128", change: "+8 this week", color: "text-primary" },
                    { label: "Clients", value: "24", change: "+3 new", color: "text-blue-500" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-2xl bg-secondary/50">
                      <div className="text-sm text-muted mb-1">{item.label}</div>
                      <div className="text-2xl font-semibold">{item.value}</div>
                      <div className={cn("text-xs", item.color)}>{item.change}</div>
                    </div>
                  ))}
                </div>
                <div className="h-40 rounded-2xl bg-secondary/30 flex items-end p-4 gap-2">
                  {[35, 55, 40, 70, 50, 85, 60, 75, 55, 90, 70, 80].map((h, i) => (
                    <div key={i} className="flex-1 rounded-lg bg-primary/40 hover:bg-primary/60 transition-colors" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
