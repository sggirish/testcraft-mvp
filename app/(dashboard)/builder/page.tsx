'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import to avoid SSR issues with React Flow
const TestBuilder = dynamic(
  () => import('@/components/builder/TestBuilder'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading Test Builder...</span>
        </div>
      </div>
    )
  }
)

export default function BuilderPage() {
  return <TestBuilder />
}