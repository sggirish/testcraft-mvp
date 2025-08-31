'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: { value: string; label: string }[]
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2 pr-10 bg-gray-900/50 border border-gray-800',
            'rounded-lg text-gray-200 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-transparent',
            'backdrop-blur-md transition-all',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-900">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
      </div>
    )
  }
)

GlassSelect.displayName = 'GlassSelect'