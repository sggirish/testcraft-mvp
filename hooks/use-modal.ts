'use client'

import { create } from 'zustand'

interface ModalStore {
  modals: Record<string, boolean>
  openModal: (id: string) => void
  closeModal: (id: string) => void
  toggleModal: (id: string) => void
  isOpen: (id: string) => boolean
}

export const useModal = create<ModalStore>((set, get) => ({
  modals: {},
  
  openModal: (id) => {
    set((state) => ({
      modals: { ...state.modals, [id]: true },
    }))
  },
  
  closeModal: (id) => {
    set((state) => ({
      modals: { ...state.modals, [id]: false },
    }))
  },
  
  toggleModal: (id) => {
    set((state) => ({
      modals: { ...state.modals, [id]: !state.modals[id] },
    }))
  },
  
  isOpen: (id) => {
    return get().modals[id] || false
  },
}))