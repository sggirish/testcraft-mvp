'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  TestTube2, 
  Play, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  FolderOpen
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { formatDate } from '@/lib/utils'

export default function TestsPage() {
  const router = useRouter()
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests')
      if (response.ok) {
        const data = await response.json()
        setTests(data)
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRunTest = (testId: string) => {
    router.push(`/runs?testId=${testId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Tests</h1>
          <p className="text-gray-400 mt-2">
            Manage and run your automated tests
          </p>
        </div>
        <GlassButton onClick={() => router.push('/builder')} variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          New Test
        </GlassButton>
      </div>

      {/* Tests Grid */}
      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <GlassSkeleton key={i} className="h-32" />
          ))
        ) : tests.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <TestTube2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No tests yet</h3>
            <p className="text-gray-400 mb-4">
              Create your first test to start automating
            </p>
            <GlassButton onClick={() => router.push('/builder')} variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </GlassButton>
          </GlassCard>
        ) : (
          tests.map((test) => (
            <GlassCard key={test.id} variant="hover" className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{test.name}</h3>
                    {test.isDraft && (
                      <GlassBadge variant="warning">Draft</GlassBadge>
                    )}
                  </div>
                  
                  {test.description && (
                    <p className="text-gray-400 text-sm mb-3">{test.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <TestTube2 className="h-4 w-4" />
                      {test.steps?.length || 0} steps
                    </span>
                    {test.project && (
                      <span className="flex items-center gap-1">
                        <FolderOpen className="h-4 w-4" />
                        {test.project.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(test.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleRunTest(test.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/builder/${test.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}