import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-16 w-full bg-black border-b border-zinc-800 px-0 py-4 text-4xl font-light tracking-tight transition-colors placeholder:text-zinc-800 focus:outline-none focus:border-white text-white selection:bg-zinc-800",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"
export { Input }