"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import type { Profile, Subscription } from "@/types/database"

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  subscription: Subscription | null
  isLoading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithGithub: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isTrialing: boolean
  trialDaysLeft: number
  canAccessFeature: (feature: string) => boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [session, setSession] = React.useState<Session | null>(null)
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [subscription, setSubscription] = React.useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const supabase = React.useMemo(() => createClient(), [])

  const fetchUserData = React.useCallback(async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Fetch subscription
      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (subscriptionData) {
        setSubscription(subscriptionData)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }, [supabase])

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession) {
          setSession(currentSession)
          setUser(currentSession.user)
          await fetchUserData(currentSession.user.id)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          await fetchUserData(newSession.user.id)
        } else {
          setProfile(null)
          setSubscription(null)
        }

        if (event === "SIGNED_OUT") {
          setProfile(null)
          setSubscription(null)
        }
      }
    )

    return () => {
      authSubscription.unsubscribe()
    }
  }, [supabase, fetchUserData])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    setSubscription(null)
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id)
    }
  }

  // Calculate trial status
  const isTrialing = subscription?.status === "trialing"
  
  const trialDaysLeft = React.useMemo(() => {
    if (!subscription?.trial_end) return 0
    const trialEnd = new Date(subscription.trial_end)
    const now = new Date()
    const diff = trialEnd.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [subscription?.trial_end])

  // Feature access based on subscription
  const canAccessFeature = (feature: string): boolean => {
    if (!subscription) return false
    
    const { plan, status } = subscription
    
    // Allow access during trial or active subscription
    if (status !== "trialing" && status !== "active") return false

    const featureAccess: Record<string, string[]> = {
      unlimited_invoices: ["professional", "business"],
      unlimited_clients: ["business"],
      premium_templates: ["professional", "business"],
      analytics: ["professional", "business"],
      api_access: ["business"],
      custom_branding: ["business"],
      team_collaboration: ["business"],
      priority_support: ["professional", "business"],
    }

    // Starter plan has basic access
    if (plan === "starter") {
      return !featureAccess[feature] || featureAccess[feature].includes("starter")
    }

    return featureAccess[feature]?.includes(plan) ?? true
  }

  const value = {
    user,
    session,
    profile,
    subscription,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    refreshProfile,
    isTrialing,
    trialDaysLeft,
    canAccessFeature,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
