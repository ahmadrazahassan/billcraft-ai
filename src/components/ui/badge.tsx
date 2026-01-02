import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        secondary: "bg-secondary text-foreground",
        accent: "bg-accent/10 text-accent",
        success: "bg-success/10 text-success",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border-2 border-border text-foreground",
        draft: "bg-muted/20 text-muted",
        sent: "bg-blue-500/10 text-blue-600",
        paid: "bg-success/10 text-success",
        overdue: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
