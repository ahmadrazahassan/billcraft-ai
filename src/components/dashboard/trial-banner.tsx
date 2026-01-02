"use client"

import * as React from "react"
import Link from "next/link"
import { Clock, ArrowRight, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function TrialBanner() {
  const { isTrialing, trialDaysLeft, subscription } = useAuth()
  const [dismissed, setDismissed] = React.useState(false)

  // Don't show if not trialing or dismissed
  if (!isTrialing || dismissed) return null

  const isUrgent = trialDaysLeft <= 3
  const isExpiring = trialDaysLeft <= 7

  return (
    <div
      className={cn(
        "relative px-4 py-3 flex items-center justify-between gap-4",
        isUrgent
          ? "bg-red-500/10 border-b border-red-500/20"
          : isExpiring
          ? "bg-amber-500/10 border-b border-amber-500/20"
          : "bg-primary/5 border-b border-primary/10"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            isUrgent
              ? "bg-red-500/20"
              : isExpiring
              ? "bg-amber-500/20"
              : "bg-primary/10"
          )}
        >
          <Clock
            className={cn(
              "w-4 h-4",
              isUrgent
                ? "text-red-500"
                : isExpiring
                ? "text-amber-500"
                : "text-primary"
            )}
          />
        </div>
        <div>
          <p className="text-sm font-medium">
            {trialDaysLeft === 0 ? (
              "Your trial ends today!"
            ) : trialDaysLeft === 1 ? (
              "Your trial ends tomorrow!"
            ) : (
              <>
                <span
                  className={cn(
                    "font-bold",
                    isUrgent
                      ? "text-red-500"
                      : isExpiring
                      ? "text-amber-500"
                      : "text-primary"
                  )}
                >
                  {trialDaysLeft} days
                </span>{" "}
                left in your {subscription?.plan} trial
              </>
            )}
          </p>
          <p className="text-xs text-muted">
            Upgrade now to keep all your premium features
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" asChild>
          <Link href="/settings/billing">
            Upgrade Now
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4 text-muted" />
        </button>
      </div>
    </div>
  )
}
