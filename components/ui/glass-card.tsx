'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', blur = 'md', children, ...props }, ref) => {
    const blurClasses = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    }

    const variantClasses = {
      default: 'glass-card',
      hover: 'glass-card hover:scale-[1.02] transition-transform duration-300',
      interactive: 'glass-card cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300',
    }

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          blurClasses[blur],
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