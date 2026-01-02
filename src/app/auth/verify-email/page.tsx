"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, ArrowLeft, RefreshCw, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<LoadingState />}>
      <VerifyEmailContent />
    </React.Suspense>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isResending, setIsResending] = React.useState(false)
  const [resendSuccess, setResendSuccess] = React.useState(false)
  const [resendError, setResendError] = React.useState<string | null>(null)
  const [countdown, setCountdown] = React.useState(0)

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (countdown > 0 || !email) return
    
    setIsResending(true)
    setResendError(null)
    setResendSuccess(false)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/confirmed`,
        },
      })

      if (error) {
        setResendError(error.message)
      } else {
        setResendSuccess(true)
        setCountdown(60) // 60 second cooldown
      }
    } catch {
      setResendError("Failed to resend email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="w-8 h-8" />
          <span className="font-semibold text-lg">Billcraft</span>
        </Link>
        <Link href="/auth" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          {/* Email Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
          <p className="text-muted mb-2">We sent a verification link to</p>
          <p className="font-medium text-lg mb-6">{email || "your email"}</p>

          <div className="p-4 rounded-xl bg-secondary/50 mb-6">
            <p className="text-sm text-muted">
              Click the link in the email to verify your account and start your 14-day free trial.
              The link will expire in 24 hours.
            </p>
          </div>

          {/* Resend Section */}
          <div className="space-y-4">
            {resendSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-emerald-500">Email sent successfully!</span>
              </div>
            )}

            {resendError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-sm text-red-500">{resendError}</span>
              </div>
            )}

            <p className="text-sm text-muted">
              Didn't receive the email? Check your spam folder or
            </p>

            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending || countdown > 0 || !email}
              className="gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Resend verification email
                </>
              )}
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted mb-3">Having trouble?</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/auth" className="text-primary hover:underline">
                Try different email
              </Link>
              <span className="text-muted">•</span>
              <Link href="mailto:support@billcraft.com" className="text-primary hover:underline">
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Billcraft. All rights reserved.
        </p>
      </div>
    </div>
  )
}
