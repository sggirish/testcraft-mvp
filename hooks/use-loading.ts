'use client'

import { create } from 'zustand'

interface LoadingStore {
  isLoading: boolean
  loadingText?: string
  setLoading: (loading: boolean, text?: string) => void
}

export const useLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  loadingText: undefined,
  setLoading: (loading, text) => set({ isLoading: loading, loadingText: text }),
}))