import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/types/database"

interface StatusBadgeProps {
  status: InvoiceStatus
}

const statusConfig: Record<InvoiceStatus, { label: string; dotClass: string; bgClass: string }> = {
  draft: { 
    label: "Draft", 
    dotClass: "bg-muted",
    bgClass: "bg-muted/20 text-muted" 
  },
  sent: { 
    label: "Sent", 
    dotClass: "bg-primary",
    bgClass: "bg-primary/10 text-primary" 
  },
  viewed: { 
    label: "Viewed", 
    dotClass: "bg-blue-500",
    bgClass: "bg-blue-500/10 text-blue-600" 
  },
  paid: { 
    label: "Paid", 
    dotClass: "bg-success",
    bgClass: "bg-success/10 text-success" 
  },
  overdue: { 
    label: "Overdue", 
    dotClass: "bg-destructive",
    bgClass: "bg-destructive/10 text-destructive" 
  },
  canceled: { 
    label: "Canceled", 
    dotClass: "bg-gray-500",
    bgClass: "bg-gray-500/10 text-gray-600" 
  },
  refunded: { 
    label: "Refunded", 
    dotClass: "bg-amber-500",
    bgClass: "bg-amber-500/10 text-amber-600" 
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
      config.bgClass
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-2", config.dotClass)} />
      {config.label}
    </span>
  )
}
