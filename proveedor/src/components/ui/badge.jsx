import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent/20 text-accent",
        secondary: "bg-sage/20 text-sage-dark",
        outline: "border border-cream text-primary",
        success: "bg-sage/20 text-sage-dark",
        warning: "bg-warning/20 text-warning",
        danger: "bg-danger/20 text-danger",
        terracotta: "bg-accent/20 text-accent",
        olive: "bg-primary-light/20 text-primary-light",
        slate: "bg-slate/20 text-slate",
        sage: "bg-sage/20 text-sage-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
