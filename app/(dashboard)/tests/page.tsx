// app/(dashboard)/tests/page.tsx
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
  FolderOpen,
  MoreVertical,
  Copy,
  Download,
  History
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { RunTestModal } from '@/components/tests/RunTestModal'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Test {
  id: string
  name: string
  description?: string
  steps?: any[]
  projectId: string
  project?: {
    name: string
  }
  version: number
  isDraft: boolean
  tags?: string[]
  createdAt: string
  updatedAt: string
  _count?: {
    runs: number
  }
}

export default function TestsPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [isRunModalOpen, setIsRunModalOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

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
      addToast({
        title: 'Error',
        description: 'Failed to fetch tests',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRunTest = (test: any) => {
    setSelectedTest(test)
    setIsRunModalOpen(true)
    setDropdownOpen(null)
  }

  const handleEditTest = (testId: string) => {
    router.push(`/builder/${testId}`)
    setDropdownOpen(null)
  }

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) {
      return
    }

    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        addToast({
          title: 'Test deleted',
          description: 'The test has been deleted successfully',
          type: 'success',
        })
        fetchTests()
      } else {
        throw new Error('Failed to delete test')
      }
    } catch (error) {
      console.error('Error deleting test:', error)
      addToast({
        title: 'Error',
        description: 'Failed to delete test',
        type: 'error',
      })
    } finally {
      setDropdownOpen(null)
    }
  }

  const handleDuplicateTest = async (test: any) => {
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${test.name} (Copy)`,
          description: test.description,
          projectId: test.projectId,
          steps: test.steps,
          variables: test.variables,
          tags: test.tags,
        }),
      })

      if (response.ok) {
        addToast({
          title: 'Test duplicated',
          description: 'The test has been duplicated successfully',
          type: 'success',
        })
        fetchTests()
      } else {
        throw new Error('Failed to duplicate test')
      }
    } catch (error) {
      console.error('Error duplicating test:', error)
      addToast({
        title: 'Error',
        description: 'Failed to duplicate test',
        type: 'error',
      })
    } finally {
      setDropdownOpen(null)
    }
  }

  const toggleDropdown = (testId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDropdownOpen(dropdownOpen === testId ? null : testId)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
        <GlassButton onClick={() => router.push('/builder/new')} variant="primary">
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
            <GlassButton onClick={() => router.push('/builder/new')} variant="primary">
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
                    <GlassBadge>v{test.version}</GlassBadge>
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
                    {test._count?.runs > 0 && (
                      <span className="flex items-center gap-1">
                        <History className="h-4 w-4" />
                        {test._count.runs} runs
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(test.createdAt)}
                    </span>
                  </div>

                  {test.tags && test.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {test.tags.map((tag: string) => (
                        <GlassBadge key={tag} variant="default">
                          {tag}
                        </GlassBadge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleRunTest(test)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </GlassButton>
                  
                  <GlassButton
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTest(test.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </GlassButton>
                  
                  <div className="relative">
                    <GlassButton
                      variant="ghost"
                      size="icon"
                      onClick={(e) => toggleDropdown(test.id, e)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </GlassButton>
                    
                    {dropdownOpen === test.id && (
                      <div className="absolute right-0 mt-2 w-48 z-10">
                        <GlassCard className="p-1" variant="dark">
                          <button
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg w-full text-left"
                            onClick={() => handleDuplicateTest(test)}
                          >
                            <Copy className="h-4 w-4" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg w-full text-left"
                            onClick={() => router.push(`/runs?testId=${test.id}`)}
                          >
                            <History className="h-4 w-4" />
                            <span>View Runs</span>
                          </button>
                          <button
                            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg w-full text-left"
                            onClick={() => handleDeleteTest(test.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </GlassCard>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Run Test Modal */}
      {selectedTest && (
        <RunTestModal
          isOpen={isRunModalOpen}
          onClose={() => {
            setIsRunModalOpen(false)
            setSelectedTest(null)
          }}
          testId={selectedTest.id}
          testName={selectedTest.name}
        />
      )}
    </div>
  )
}