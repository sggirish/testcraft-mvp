'use client'

import { cn } from '@/lib/utils'

interface GlassBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

export function GlassBadge({ 
  children, 
  variant = 'default', 
  className 
}: GlassBadgeProps) {
  const variantClasses = {
    default: 'glass-badge',
    success: 'glass-badge text-green-500 border-green-500/20',
    warning: 'glass-badge text-yellow-500 border-yellow-500/20',
    error: 'glass-badge text-red-500 border-red-500/20',
  }

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  )
}