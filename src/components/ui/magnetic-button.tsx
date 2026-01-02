"use client"

import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends ButtonProps {
  magneticStrength?: number
}

export function MagneticButton({
  children,
  className,
  magneticStrength = 0.4,
  ...props
}: MagneticButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * magneticStrength
    const deltaY = (e.clientY - centerY) * magneticStrength
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <Button
      ref={buttonRef}
      className={cn(
        "transition-transform duration-300 ease-out",
        isHovered && "shadow-lg",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      <span
        className="flex items-center gap-2 transition-transform duration-300"
        style={{
          transform: `translate(${position.x * 0.2}px, ${position.y * 0.2}px)`,
        }}
      >
        {children}
      </span>
    </Button>
  )
}
