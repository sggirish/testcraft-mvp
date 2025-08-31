'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3 py-2 bg-gray-900/50 border border-gray-800',
          'rounded-lg text-gray-200 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent',
          'backdrop-blur-md transition-all resize-none',
          error && 'border-red-500 focus:ring-red-500/50',
          className
        )}
        {...props}
      />
    )
  }
)

GlassTextarea.displayName = 'GlassTextarea'