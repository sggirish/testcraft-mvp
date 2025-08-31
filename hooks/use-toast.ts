'use client'

import { create } from 'zustand'

export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duration = toast.duration || 5000
    
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
  
  clearToasts: () => {
    set({ toasts: [] })
  },
}))

// Helper hook for toast actions
export function useToastActions() {
  const { addToast } = useToast()
  
  return {
    success: (title: string, description?: string) => {
      addToast({ title, description, type: 'success' })
    },
    error: (title: string, description?: string) => {
      addToast({ title, description, type: 'error' })
    },
    warning: (title: string, description?: string) => {
      addToast({ title, description, type: 'warning' })
    },
    info: (title: string, description?: string) => {
      addToast({ title, description, type: 'info' })
    },
  }
}