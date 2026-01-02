"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, Moon, Sun, FileText, Users, BarChart3, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogoIcon } from "@/components/ui/logo"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const features = [
  { icon: FileText, label: "AI-powered invoices" },
  { icon: Users, label: "Client management" },
  { icon: BarChart3, label: "Revenue analytics" },
  { icon: CreditCard, label: "Payment tracking" },
]

// Wrap the main component to handle Suspense for useSearchParams
export default function AuthPage() {
  return (
    <React.Suspense fallback={<AuthPageLoading />}>
      <AuthPageContent />
    </React.Suspense>
  )
}

function AuthPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()
  const { signIn, signUp, signInWithGoogle, signInWithGithub, user, isLoading: authLoading } = useAuth()
  
  const [activeTab, setActiveTab] = React.useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  })

  // Check for error in URL params
  React.useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
    }
  }, [searchParams])

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !authLoading) {
      const redirect = searchParams.get("redirect") || "/dashboard"
      router.push(redirect)
    }
  }, [user, authLoading, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (activeTab === "signup") {
        const { error } = await signUp(formData.email, formData.password, formData.name)
        if (error) {
          setError(error.message)
        } else {
          // Redirect to dashboard after successful signup
          const redirect = searchParams.get("redirect") || "/dashboard"
          router.push(redirect)
        }
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          const redirect = searchParams.get("redirect") || "/dashboard"
          router.push(redirect)
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
  }

  const handleGithubSignIn = async () => {
    setError(null)
    const { error } = await signInWithGithub()
    if (error) {
      setError(error.message)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Minimal Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary p-12 flex-col justify-between overflow-hidden rounded-r-[3rem]">
        <div className="absolute inset-0 dot-pattern opacity-[0.08]" />
        
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon className="w-10 h-10 [&_rect:first-child]:fill-white/20 [&_path]:fill-white [&_rect:not(:first-child)]:fill-white/20 [&_circle]:fill-primary-light" />
            <span className="font-semibold text-xl text-white">Billcraft</span>
          </Link>
        </div>
        
        <div className="relative">
          <h1 className="text-5xl xl:text-6xl font-semibold text-white leading-tight mb-4">
            Invoice
            <br />
            smarter.
          </h1>
          
          {/* 14-day trial badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-8">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-white/90 text-sm font-medium">14-day free trial on all plans</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 p-4 rounded-2xl bg-white/10">
                <feature.icon className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative flex items-center gap-8">
          <div>
            <p className="text-3xl font-bold text-white">10K+</p>
            <p className="text-sm text-white/60">Businesses</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <p className="text-3xl font-bold text-white">$50M+</p>
            <p className="text-sm text-white/60">Invoiced</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <p className="text-3xl font-bold text-white">4.9</p>
            <p className="text-sm text-white/60">Rating</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center mb-8">
              <Link href="/" className="flex items-center gap-2.5">
                <LogoIcon className="w-10 h-10" />
                <span className="font-semibold text-xl">Billcraft</span>
              </Link>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1.5 rounded-full bg-secondary mb-8">
              <button
                onClick={() => { setActiveTab("signin"); setError(null); setSuccess(null); }}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300",
                  activeTab === "signin"
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-muted hover:text-foreground"
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab("signup"); setError(null); setSuccess(null); }}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all duration-300",
                  activeTab === "signup"
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-muted hover:text-foreground"
                )}
              >
                Sign Up
              </button>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                {activeTab === "signin" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-muted">
                {activeTab === "signin"
                  ? "Enter your credentials to continue"
                  : "Start your 14-day free trial today"}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-500">{success}</p>
              </div>
            )}

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="gap-2 rounded-xl" onClick={handleGoogleSignIn}>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl" onClick={handleGithubSignIn}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-secondary" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-background text-muted">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "signup" && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-11 rounded-xl"
                    required
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 rounded-xl"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 pr-11 rounded-xl"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {activeTab === "signin" && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                    <span className="text-muted">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              {activeTab === "signup" && (
                <>
                  {/* Trial Badge */}
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">14-day free trial included</p>
                      <p className="text-xs text-muted">No credit card required. Cancel anytime.</p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer text-sm">
                    <input type="checkbox" className="w-4 h-4 rounded accent-primary mt-0.5" required />
                    <span className="text-muted">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                </>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-xl"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {activeTab === "signin" ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  activeTab === "signin" ? "Sign In" : "Start Free Trial"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted mt-8">
              {activeTab === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => { setActiveTab("signup"); setError(null); }} className="text-primary hover:underline font-medium">
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => { setActiveTab("signin"); setError(null); }} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
