// components/builder/BuilderGuide.tsx
'use client'

import { useState } from 'react'
import { X, Info, MousePointer, Link2, Zap } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'

export function BuilderGuide() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-10 p-2 rounded-lg bg-gray-900/90 backdrop-blur-sm border border-gray-800 hover:bg-gray-800 transition-all"
      >
        <Info className="w-4 h-4 text-gray-400" />
      </button>
    )
  }

  return (
    <div className="absolute top-4 left-4 z-10 w-72">
      <GlassCard className="p-4" variant="dark">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            Quick Guide
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-800 rounded transition-all"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2">
            <div className="p-1 bg-purple-500/20 rounded mt-0.5">
              <MousePointer className="w-3 h-3 text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-200 mb-1">Add Steps</p>
              <p className="text-gray-400">Click buttons at the bottom to add test steps</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="p-1 bg-blue-500/20 rounded mt-0.5">
              <Link2 className="w-3 h-3 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-200 mb-1">Connect Steps</p>
              <p className="text-gray-400">Drag from bottom handle to top handle of next step</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-3">
            <p className="text-gray-500">💡 Tip: Click any step to configure its properties</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}