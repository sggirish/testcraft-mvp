'use client'

import { SessionProvider } from 'next-auth/react'
import { GlassToastContainer } from '@/components/ui/glass-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <GlassToastContainer />
    </SessionProvider>
  )
}