'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { Sidebar } from './sidebar'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 z-50 md:hidden">
        <div className="relative h-full">
          <Sidebar />
          <GlassButton
            variant="ghost"
            size="icon"
            className="absolute top-6 right-6"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </GlassButton>
        </div>
      </div>
    </>
  )
}