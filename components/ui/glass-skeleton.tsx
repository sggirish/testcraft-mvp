'use client'

import { cn } from '@/lib/utils'

interface GlassSkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export function GlassSkeleton({
  className,
  variant = 'rectangular',
}: GlassSkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-800/50 backdrop-blur-md',
        variantClasses[variant],
        className
      )}
    />
  )
}