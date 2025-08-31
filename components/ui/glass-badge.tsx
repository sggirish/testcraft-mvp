'use client'

import { cn } from '@/lib/utils'

interface GlassBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

export function GlassBadge({ 
  children, 
  variant = 'default', 
  className 
}: GlassBadgeProps) {
  const variantClasses = {
    default: 'bg-gray-800/50 border-gray-700 text-gray-300',
    success: 'bg-green-900/20 border-green-800/50 text-green-400',
    warning: 'bg-yellow-900/20 border-yellow-800/50 text-yellow-400',
    error: 'bg-red-900/20 border-red-800/50 text-red-400',
    info: 'bg-blue-900/20 border-blue-800/50 text-blue-400',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      'backdrop-blur-md border',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  )
}