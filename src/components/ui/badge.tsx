import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "inline-flex items-center border border-zinc-800 bg-black px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 transition-colors hover:border-zinc-500 hover:text-white",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
export { Badge }