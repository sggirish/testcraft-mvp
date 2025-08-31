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
          'glass-input w-full min-h-[100px] resize-y',
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
    )
  }
)

GlassTextarea.displayName = 'GlassTextarea'