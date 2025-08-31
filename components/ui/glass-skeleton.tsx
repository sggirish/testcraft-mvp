'use client'

import { cn } from '@/lib/utils'

interface GlassSkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  animation?: 'pulse' | 'shimmer'
}

export function GlassSkeleton({
  className,
  variant = 'rectangular',
  animation = 'shimmer',
}: GlassSkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  }

  const animationClasses = {
    pulse: 'animate-pulse bg-muted',
    shimmer: 'shimmer bg-muted',
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  )
}