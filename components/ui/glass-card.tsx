'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'gradient' | 'dark'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  noPadding?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', blur = 'xl', noPadding = false, children, ...props }, ref) => {
    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    }

    const variantClasses = {
      default: 'bg-gray-900/50 border border-gray-800',
      hover: 'bg-gray-900/50 border border-gray-800 hover:bg-gray-900/70 hover:border-gray-700 transition-all duration-300',
      gradient: 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30',
      dark: 'bg-black/50 border border-gray-800'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          blurClasses[blur],
          variantClasses[variant],
          !noPadding && 'p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'