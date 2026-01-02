"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Users,
  Layout,
  BarChart3,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Loader2,
} from "lucide-react"
import { Logo, LogoIcon } from "@/components/ui/logo"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
  { href: "/invoices", icon: FileText, label: "Invoices", badge: null },
  { href: "/clients", icon: Users, label: "Clients", badge: null },
  { href: "/dashboard/templates", icon: Layout, label: "Templates", badge: null },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics", badge: null },
]

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export const SidebarContext = React.createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { collapsed, setCollapsed } = useSidebar()
  const { user, profile, subscription, signOut, isTrialing, trialDaysLeft } = useAuth()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.push("/")
  }

  // Get user display info
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User"
  const displayEmail = user?.email || ""
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card z-50 flex flex-col transition-all duration-300 ease-out border-r border-border",
        collapsed ? "w-[76px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className={cn(
        "h-[72px] flex items-center transition-all duration-300 border-b border-border",
        collapsed ? "justify-center px-3" : "justify-between px-5"
      )}>
        <Link href="/" className="flex items-center">
          {collapsed ? (
            <LogoIcon className="w-10 h-10" />
          ) : (
            <Logo size="md" />
          )}
        </Link>
        
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-secondary transition-all duration-200"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {/* Quick Action */}
      <div className={cn("px-3 pt-5", collapsed && "px-3")}>
        <Link
          href="/invoices/new"
          className={cn(
            "flex items-center justify-center gap-2 bg-primary text-white rounded-xl font-medium text-sm transition-all duration-200 hover:bg-primary-dark",
            collapsed ? "w-10 h-10 mx-auto" : "w-full py-2.5 px-4"
          )}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span>New Invoice</span>}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold px-3 mb-3">
            Navigation
          </p>
        )}
        
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center rounded-xl text-[13px] font-medium transition-all duration-200",
                  collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-white text-[10px]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-5">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold px-3 mb-3">
            Account
          </p>
        )}

        {/* Trial Status */}
        {isTrialing && !collapsed && (
          <Link
            href="/settings/billing"
            className="flex items-center gap-2 px-3 py-2 mb-3 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">
              {trialDaysLeft} days left in trial
            </span>
          </Link>
        )}
        
        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            "group relative flex items-center rounded-xl text-[13px] font-medium transition-all duration-200 mb-3",
            collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5",
            pathname === "/settings" || pathname.startsWith("/settings/")
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground hover:bg-secondary"
          )}
        >
          <Settings className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
          
          {collapsed && (
            <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[60] pointer-events-none">
              Settings
            </div>
          )}
        </Link>

        {/* Divider */}
        <div className="h-px bg-border mb-3" />

        {/* User Profile */}
        <div className={cn(
          "flex items-center rounded-xl bg-secondary/60 transition-all duration-300",
          collapsed ? "justify-center p-2" : "gap-3 p-3"
        )}>
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl}
              alt={displayName}
              className={cn(
                "rounded-full object-cover transition-all duration-200 bg-secondary",
                collapsed ? "w-9 h-9" : "w-10 h-10"
              )}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-card" />
          </div>
          
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-[11px] text-muted truncate">{displayEmail}</p>
              </div>
              
              <button 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="p-1.5 rounded-lg hover:bg-card text-muted hover:text-foreground transition-all duration-200 disabled:opacity-50"
                aria-label="Sign out"
              >
                {isSigningOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl text-muted hover:text-foreground hover:bg-secondary transition-all duration-200 mt-3"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
    </aside>
  )
}
