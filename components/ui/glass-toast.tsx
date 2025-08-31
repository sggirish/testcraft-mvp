'use client'

import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export function GlassToastContainer() {
  const { toasts, removeToast } = useToast()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="min-w-[350px] rounded-lg p-4 pr-12 bg-gray-900/95 backdrop-blur-xl border border-gray-800 shadow-xl animate-slide-left"
        >
          <div className="flex items-start gap-3">
            {getIcon(toast.type)}
            <div className="flex-1">
              <p className="font-medium text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-sm text-gray-400 mt-1">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-3 right-3 p-1 hover:bg-gray-800 rounded transition-all"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}