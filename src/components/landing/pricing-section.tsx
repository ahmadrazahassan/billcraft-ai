"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ArrowRight, Clock, Infinity } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free Trial",
    price: "0",
    period: "for 14 days",
    description: "Full access to everything, no limits",
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "All premium templates",
      "Analytics dashboard",
      "Payment reminders",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    highlight: false,
    trial: true,
    trialPlan: true,
  },
  {
    name: "Professional",
    price: "19",
    period: "per month",
    description: "Everything you need to grow",
    features: [
      "Unlimited invoices",
      "Up to 100 clients",
      "All premium templates",
      "Payment reminders",
      "Analytics dashboard",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    highlight: true,
    trial: true,
    trialPlan: false,
  },
  {
    name: "Business",
    price: "49",
    period: "per month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Unlimited clients",
      "API access",
      "White-label invoices",
      "Team collaboration",
      "Dedicated manager",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    highlight: false,
    trial: true,
    trialPlan: false,
  },
]

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = React.useState(true)

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">Pricing</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto mb-6">
              Start free, upgrade when you need. No hidden fees, cancel anytime.
            </p>
            
            {/* Trial Badge - Above toggle */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                14-day free trial with full access • No credit card required
              </span>
            </div>

            {/* Billing Toggle - Below trial badge */}
            <div className="block">
              <div className="inline-flex items-center p-1.5 rounded-full bg-card">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                    !isAnnual ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-muted hover:text-foreground"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                    isAnnual ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-muted hover:text-foreground"
                  )}
                >
                  Annual
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", isAnnual ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}>-20%</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 100}>
              <div className={cn(
                "relative p-8 rounded-[2rem] transition-all duration-500 h-full flex flex-col",
                plan.highlight
                  ? "bg-primary text-white scale-105 shadow-2xl shadow-primary/20"
                  : "bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              )}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-primary-light text-primary text-xs font-semibold shadow-lg">Most Popular</span>
                  </div>
                )}

                {/* Trial Badge */}
                {plan.trialPlan ? (
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Infinity className="w-3 h-3" />
                    No limits for 14 days
                  </div>
                ) : plan.trial && (
                  <div className={cn(
                    "mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit",
                    plan.highlight ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  )}>
                    <Clock className="w-3 h-3" />
                    14-day free trial
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={cn("text-lg font-semibold mb-2", plan.highlight ? "text-white" : "text-foreground")}>{plan.name}</h3>
                  <p className={cn("text-sm", plan.highlight ? "text-white/70" : "text-muted")}>{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className={cn("text-5xl font-bold", plan.highlight ? "text-white" : "text-foreground")}>
                      ${plan.trialPlan ? "0" : (isAnnual ? Math.floor(parseInt(plan.price) * 0.8) : plan.price)}
                    </span>
                    <span className={cn("text-sm", plan.highlight ? "text-white/60" : "text-muted")}>/{plan.period}</span>
                  </div>
                  {!plan.trialPlan && isAnnual && plan.price !== "0" && (
                    <p className={cn("text-xs mt-1", plan.highlight ? "text-white/50" : "text-muted")}>
                      Billed annually (${Math.floor(parseInt(plan.price) * 0.8 * 12)}/year)
                    </p>
                  )}
                  {plan.trialPlan && (
                    <p className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">
                      Then choose a plan that fits
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", plan.highlight ? "bg-white/20" : "bg-primary/10")}>
                        <Check className={cn("h-3 w-3", plan.highlight ? "text-white" : "text-primary")} />
                      </div>
                      <span className={plan.highlight ? "text-white/90" : "text-foreground"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? "secondary" : "primary"}
                  className={cn("w-full gap-2", plan.highlight && "bg-white text-primary hover:bg-white/90")}
                  asChild
                >
                  <Link href={`/auth?plan=${plan.trialPlan ? "trial" : plan.name.toLowerCase()}`}>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <p className={cn("text-xs text-center mt-3", plan.highlight ? "text-white/50" : "text-muted")}>
                  No credit card required
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex -space-x-3">
              {avatars.map((avatar, i) => (
                <Image
                  key={i}
                  src={avatar}
                  alt="Customer"
                  width={40}
                  height={40}
                  className="rounded-full ring-4 ring-background object-cover"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="font-medium">Trusted by 10,000+ businesses</p>
              <p className="text-sm text-muted">Join them today with a free 14-day trial</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
