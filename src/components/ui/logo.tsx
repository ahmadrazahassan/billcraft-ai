"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-base", gap: "gap-2" },
    md: { icon: "w-10 h-10", text: "text-lg", gap: "gap-2.5" },
    lg: { icon: "w-12 h-12", text: "text-xl", gap: "gap-3" },
    xl: { icon: "w-14 h-14", text: "text-2xl", gap: "gap-3" },
  }

  const s = sizes[size]

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <LogoIcon className={s.icon} />
      {showText && (
        <span className={cn("font-semibold tracking-tight", s.text)}>
          Billcraft
        </span>
      )}
    </div>
  )
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-10 h-10", className)}>
      {/* Main rounded square */}
      <rect x="2" y="2" width="36" height="36" rx="10" className="fill-primary" />
      
      {/* Abstract B mark made of geometric shapes */}
      <path 
        d="M12 10H22C25.3137 10 28 12.6863 28 16C28 17.5 27.5 18.8 26.6 19.8C28 20.8 29 22.5 29 24.5C29 28.0899 26.0899 31 22.5 31H12V10Z" 
        className="fill-white"
      />
      
      {/* Cut-out shapes to create the B */}
      <rect x="16" y="14" width="6" height="4" rx="2" className="fill-primary" />
      <rect x="16" y="23" width="8" height="4" rx="2" className="fill-primary" />
      
      {/* Accent dot */}
      <circle cx="32" cy="8" r="5" className="fill-primary-light" />
    </svg>
  )
}
