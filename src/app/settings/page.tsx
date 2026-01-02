"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, Save, User, Building, Bell, Shield, CreditCard, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, profile, subscription, isTrialing, trialDaysLeft, refreshProfile } = useAuth()
  const [isSaving, setIsSaving] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)
  
  const [profileData, setProfileData] = React.useState({
    full_name: "",
    company_name: "",
    company_phone: "",
    company_email: "",
  })
  
  const [business, setBusiness] = React.useState({
    currency: "USD",
    taxRate: "10",
    paymentTerms: "30",
  })

  // Load profile data
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        company_name: profile.company_name || "",
        company_phone: profile.company_phone || "",
        company_email: profile.company_email || user?.email || "",
      })
    }
  }, [profile, user])

  const handleSaveProfile = async () => {
    if (!user) return
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          company_name: profileData.company_name,
          company_phone: profileData.company_phone,
          company_email: profileData.company_email,
        } as Record<string, unknown>)
        .eq("id", user.id)
      
      if (error) throw error
      
      await refreshProfile()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted">Manage your account and preferences</p>
      </div>

      {/* Subscription Card */}
      <Link href="/settings/billing" className="block">
        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Subscription</h3>
                <p className="text-sm text-muted">
                  {isTrialing ? (
                    <span className="text-primary">{trialDaysLeft} days left in trial</span>
                  ) : (
                    <span className="capitalize">{subscription?.plan || "Starter"} plan</span>
                  )}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Profile</h3>
            <p className="text-sm text-muted">Your personal information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input 
                value={profileData.full_name} 
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input 
                type="email" 
                value={user?.email || ""} 
                disabled 
                className="opacity-60"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company</label>
              <Input 
                value={profileData.company_name} 
                onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input 
                value={profileData.company_phone} 
                onChange={(e) => setProfileData({ ...profileData, company_phone: e.target.value })} 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
            {saveSuccess && (
              <span className="text-sm text-emerald-500">Saved successfully!</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Appearance</h3>
            <p className="text-sm text-muted">Customize how Billcraft looks</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                theme === t.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              <t.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Business Settings</h3>
            <p className="text-sm text-muted">Configure your invoice defaults</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <select
                value={business.currency}
                onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
                className="w-full h-11 rounded-full border border-border bg-background px-4 text-sm transition-all duration-200 focus:border-primary/40 focus:outline-none"
              >
                {currencies.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Default Tax Rate (%)</label>
              <Input type="number" value={business.taxRate} onChange={(e) => setBusiness({ ...business, taxRate: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Payment Terms (days)</label>
              <Input type="number" value={business.paymentTerms} onChange={(e) => setBusiness({ ...business, paymentTerms: e.target.value })} />
            </div>
          </div>
          <Button variant="primary" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-muted">Manage your notification preferences</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: "Email notifications for new payments", checked: true },
            { label: "Payment reminder notifications", checked: true },
            { label: "Weekly summary reports", checked: false },
            { label: "Marketing and product updates", checked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-secondary/50 transition-colors">
              <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5 rounded-md border-2 border-border accent-primary" />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border-2 border-destructive/20">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-destructive/10">
          <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted">Irreversible actions</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Delete Account</p>
            <p className="text-xs text-muted">Permanently delete your account and all data</p>
          </div>
          <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
