'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: React.ReactNode
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 bg-gray-900/50 border border-gray-800',
            'rounded-lg text-gray-200 placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent',
            'backdrop-blur-md transition-all',
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'