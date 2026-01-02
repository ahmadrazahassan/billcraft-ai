"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo"
import { useAuth } from "@/contexts/auth-context"
import confetti from "canvas-confetti"

export default function EmailConfirmedPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [countdown, setCountdown] = React.useState(5)
  const confettiTriggered = React.useRef(false)

  // Trigger confetti on mount
  React.useEffect(() => {
    if (!confettiTriggered.current) {
      confettiTriggered.current = true
      
      // Fire confetti
      const duration = 2000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#6366f1", "#8b5cf6", "#a855f7"],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#6366f1", "#8b5cf6", "#a855f7"],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [])

  // Auto-redirect countdown
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      router.push("/dashboard")
    }
  }, [countdown, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-center p-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="w-8 h-8" />
          <span className="font-semibold text-lg">Billcraft</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold mb-2">Email Verified!</h1>
          <p className="text-muted mb-6">
            Welcome to Billcraft{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
          </p>

          {/* Trial Info */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">14-Day Free Trial Activated</span>
            </div>
            <p className="text-sm text-muted">
              You have full access to all features. No credit card required.
            </p>
          </div>

          {/* What's Next */}
          <div className="text-left p-5 rounded-2xl bg-secondary/50 mb-6">
            <p className="font-medium mb-3">Here's what you can do:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Create your first invoice in minutes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Add clients and manage contacts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Choose from 15+ professional templates
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Track payments and revenue
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Button
            variant="primary"
            size="lg"
            className="w-full gap-2"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-sm text-muted mt-4">
            Redirecting in {countdown} seconds...
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted">
          Need help getting started?{" "}
          <Link href="mailto:support@billcraft.com" className="text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
