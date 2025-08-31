// app/(dashboard)/builder/[id]/page.tsx
'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import to avoid SSR issues with React Flow
const TestBuilder = dynamic(
  () => import('@/components/builder/TestBuilder'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-950">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading Test Builder...</span>
        </div>
      </div>
    )
  }
)

export default function EditTestPage() {
  // Remove all padding and make it full height within the dashboard layout
  return (
    <div className="h-[calc(100vh-5rem)] -m-6 relative">
      <TestBuilder />
    </div>
  )
}