import Link from "next/link"
import { Plus, UserPlus, FileText, Send, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const actions = [
  { 
    icon: Plus, 
    label: "New Invoice", 
    description: "Create invoice",
    href: "/invoices/new", 
    primary: true,
  },
  { 
    icon: UserPlus, 
    label: "Add Client", 
    description: "New client",
    href: "/clients/new", 
    primary: false,
  },
  { 
    icon: FileText, 
    label: "Templates", 
    description: "Browse all",
    href: "/dashboard/templates", 
    primary: false,
  },
  { 
    icon: Send, 
    label: "Reminder", 
    description: "Send now",
    href: "#", 
    primary: false,
  },
]

export function QuickActions() {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border h-full">
      <div className="mb-5">
        <h3 className="font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted">Common tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              "group p-4 rounded-xl transition-all duration-200 flex flex-col",
              action.primary
                ? "bg-primary text-white col-span-2"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                action.primary ? "bg-white/20" : "bg-card"
              )}>
                <action.icon className="h-4 w-4" />
              </div>
              <ArrowUpRight className={cn(
                "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity",
                action.primary ? "text-white/70" : "text-muted"
              )} />
            </div>
            <span className="font-medium text-sm">{action.label}</span>
            <span className={cn(
              "text-xs",
              action.primary ? "text-white/70" : "text-muted"
            )}>{action.description}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
