 "use client"

import * as React from "react"
import { Check, Clock, CreditCard, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    description: "Perfect for trying out Billcraft",
    features: ["5 invoices per month", "Up to 10 clients", "Basic templates", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 19,
    description: "Everything you need to grow",
    features: ["Unlimited invoices", "Up to 100 clients", "All premium templates", "Payment reminders", "Analytics dashboard", "Priority support"],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 49,
    description: "For teams and agencies",
    features: ["Everything in Pro", "Unlimited clients", "API access", "White-label invoices", "Team collaboration", "Dedicated manager"],
  },
]

export default function BillingPage() {
  const { subscription, isTrialing, trialDaysLeft } = useAuth()
  const [isAnnual, setIsAnnual] = React.useState(true)

  const currentPlan = subscription?.plan || "starter"
  const trialEnd = subscription?.trial_end ? new Date(subscription.trial_end) : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Billing & Subscription</h1>
        <p className="text-muted">Manage your subscription and billing details</p>
      </div>

      {/* Current Plan Status */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold">Current Plan</h2>
              {isTrialing && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Trial
                </span>
              )}
            </div>
            <p className="text-muted">
              You&apos;re currently on the{" "}
              <span className="font-medium text-foreground capitalize">{currentPlan}</span> plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              ${plans.find((p) => p.id === currentPlan)?.price || 0}
              <span className="text-sm font-normal text-muted">/mo</span>
            </p>
          </div>
        </div>

        {isTrialing && trialEnd && (
          <div className={cn(
            "p-4 rounded-xl flex items-center gap-4",
            trialDaysLeft <= 3 ? "bg-red-500/10 border border-red-500/20" : "bg-primary/5 border border-primary/10"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              trialDaysLeft <= 3 ? "bg-red-500/20" : "bg-primary/10"
            )}>
              <Clock className={cn("w-5 h-5", trialDaysLeft <= 3 ? "text-red-500" : "text-primary")} />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {trialDaysLeft === 0
                  ? "Your trial ends today!"
                  : trialDaysLeft === 1
                  ? "Your trial ends tomorrow!"
                  : `${trialDaysLeft} days left in your trial`}
              </p>
              <p className="text-sm text-muted">
                Trial ends on {trialEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <Button variant="primary" size="sm">
              Upgrade Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {!isTrialing && subscription?.status === "active" && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">Active Subscription</p>
              <p className="text-sm text-muted">
                Next billing date:{" "}
                {subscription.current_period_end
                  ? new Date(subscription.current_period_end).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Plan Selection */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Available Plans</h2>
          <div className="flex items-center p-1 rounded-full bg-secondary">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                !isAnnual ? "bg-primary text-white" : "text-muted hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                isAnnual ? "bg-primary text-white" : "text-muted hover:text-foreground"
              )}
            >
              Annual
              <span className={cn("px-1.5 py-0.5 rounded text-xs", isAnnual ? "bg-white/20" : "bg-primary/10 text-primary")}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan
            const price = isAnnual && plan.price > 0 ? Math.floor(plan.price * 0.8) : plan.price

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative p-6 rounded-2xl border transition-all",
                  plan.popular
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30",
                  isCurrentPlan && "ring-2 ring-primary"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted">/mo</span>
                  {isAnnual && plan.price > 0 && (
                    <p className="text-xs text-muted mt-1">Billed annually (${price * 12}/year)</p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrentPlan ? "outline" : plan.popular ? "primary" : "outline"}
                  className="w-full"
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        
        <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="w-12 h-8 rounded bg-secondary flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-muted" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted">No payment method added</p>
          </div>
          <Button variant="outline" size="sm">
            Add Card
          </Button>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              No credit card required during trial
            </p>
            <p className="text-xs text-muted mt-1">
              You can add a payment method anytime before your trial ends to continue using premium features.
            </p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h2 className="text-lg font-semibold mb-4">Billing History</h2>
        
        <div className="text-center py-8 text-muted">
          <p>No billing history yet</p>
          <p className="text-sm mt-1">Your invoices will appear here after your first payment</p>
        </div>
      </div>
    </div>
  )
}
