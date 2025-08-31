'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassButton } from './glass-button'

interface GlassModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: GlassModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      <div
        ref={modalRef}
        className={cn(
          'relative bg-gray-900/95 backdrop-blur-xl border border-gray-800',
          'rounded-xl shadow-2xl max-w-lg w-full p-6',
          'animate-fade-in',
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                {description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <GlassButton
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </GlassButton>
            )}
          </div>
        )}
        
        {children}
      </div>
    </div>
  )
}