import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-cream-dark bg-cream/50 px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, Textarea }
