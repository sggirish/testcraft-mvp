// app/(dashboard)/runs/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Play, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  FileText,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Image,
  X
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface TestRun {
  id: string
  status: string
  trigger: string
  startedAt: string
  completedAt?: string
  duration?: number
  passed: number
  failed: number
  skipped: number
  error?: string
  logs?: any[]
  screenshots?: string[]
  browser?: string
  test: {
    name: string
    project?: {
      name: string
    }
  }
}

export default function RunsPage() {
  const searchParams = useSearchParams()
  const testId = searchParams?.get('testId')
  const { addToast } = useToast()
  
  const [runs, setRuns] = useState<TestRun[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRun, setSelectedRun] = useState<TestRun | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchRuns()
  }, [testId])

  const fetchRuns = async () => {
    try {
      const url = testId 
        ? `/api/runs?testId=${testId}`
        : '/api/runs'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRuns(data.runs || [])
      }
    } catch (error) {
      console.error('Error fetching runs:', error)
      addToast({
        title: 'Error',
        description: 'Failed to fetch test runs',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRun = async (runId: string) => {
    if (!confirm('Are you sure you want to delete this test run?')) {
      return
    }

    try {
      const response = await fetch(`/api/runs/${runId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        addToast({
          title: 'Run deleted',
          description: 'Test run has been deleted',
          type: 'success',
        })
        fetchRuns()
        if (selectedRun?.id === runId) {
          setSelectedRun(null)
          setShowDetails(false)
        }
      }
    } catch (error) {
      console.error('Error deleting run:', error)
      addToast({
        title: 'Error',
        description: 'Failed to delete test run',
        type: 'error',
      })
    }
  }

  const loadRunDetails = async (run: TestRun) => {
    try {
      const response = await fetch(`/api/runs/${run.id}`)
      if (response.ok) {
        const fullRun = await response.json()
        setSelectedRun(fullRun)
        setShowDetails(true)
      }
    } catch (error) {
      console.error('Error loading run details:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'RUNNING':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <GlassBadge variant="success">Passed</GlassBadge>
      case 'FAILED':
        return <GlassBadge variant="error">Failed</GlassBadge>
      case 'RUNNING':
        return <GlassBadge variant="info">Running</GlassBadge>
      default:
        return <GlassBadge variant="warning">Pending</GlassBadge>
    }
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return '-'
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${seconds}s`
  }

  const filteredRuns = runs.filter(run => {
    if (filter === 'all') return true
    return run.status === filter
  })

  // Calculate stats
  const stats = {
    total: runs.length,
    passed: runs.filter(r => r.status === 'PASSED').length,
    failed: runs.filter(r => r.status === 'FAILED').length,
    running: runs.filter(r => r.status === 'RUNNING').length,
    avgDuration: runs.reduce((acc, r) => acc + (r.duration || 0), 0) / runs.length || 0,
    successRate: runs.length > 0 
      ? Math.round((runs.filter(r => r.status === 'PASSED').length / runs.length) * 100)
      : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Test Runs</h1>
          <p className="text-gray-400 mt-2">
            View and analyze test execution history
          </p>
        </div>
        <GlassButton onClick={fetchRuns} variant="primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </GlassButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Runs</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Play className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Passed</p>
              <p className="text-2xl font-bold text-green-400">{stats.passed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
            </div>
            {stats.successRate >= 80 ? (
              <TrendingUp className="h-8 w-8 text-green-400" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-400" />
            )}
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-white">
                {formatDuration(stats.avgDuration)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </GlassCard>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <GlassButton
          variant={filter === 'all' ? 'primary' : 'default'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </GlassButton>
        <GlassButton
          variant={filter === 'PASSED' ? 'primary' : 'default'}
          size="sm"
          onClick={() => setFilter('PASSED')}
        >
          Passed ({stats.passed})
        </GlassButton>
        <GlassButton
          variant={filter === 'FAILED' ? 'primary' : 'default'}
          size="sm"
          onClick={() => setFilter('FAILED')}
        >
          Failed ({stats.failed})
        </GlassButton>
      </div>

      {/* Runs List and Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Runs List */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Runs</h2>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <GlassSkeleton key={i} className="h-24" />
              ))
            ) : filteredRuns.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-400">No test runs found</p>
              </GlassCard>
            ) : (
              filteredRuns.map((run) => (
                <GlassCard
                  key={run.id}
                  variant="hover"
                  className={`p-4 cursor-pointer ${
                    selectedRun?.id === run.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => loadRunDetails(run)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(run.status)}
                      <div>
                        <h3 className="font-semibold text-white">{run.test.name}</h3>
                        <p className="text-sm text-gray-400">
                          {run.test.project?.name || 'No project'}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(run.duration)}
                          </span>
                          {run.browser && (
                            <span className="capitalize">{run.browser}</span>
                          )}
                          <span>{formatDate(run.startedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(run.status)}
                      <GlassButton
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRun(run.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </GlassButton>
                    </div>
                  </div>
                  
                  {run.error && (
                    <div className="mt-3 p-2 bg-red-900/20 rounded text-xs text-red-400">
                      {run.error}
                    </div>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        </div>

        {/* Run Details */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Run Details</h2>
          {selectedRun && showDetails ? (
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {selectedRun.test.name}
                </h3>
                {getStatusBadge(selectedRun.status)}
              </div>
              
              {/* Test Results */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Test Results</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{selectedRun.passed}</p>
                    <p className="text-xs text-gray-400">Passed</p>
                  </div>
                  <div className="text-center p-3 bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">{selectedRun.failed}</p>
                    <p className="text-xs text-gray-400">Failed</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-400">{selectedRun.skipped}</p>
                    <p className="text-xs text-gray-400">Skipped</p>
                  </div>
                </div>
              </div>

              {/* Execution Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Execution Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{formatDuration(selectedRun.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Browser</span>
                    <span className="text-white capitalize">{selectedRun.browser || 'Chrome'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trigger</span>
                    <span className="text-white capitalize">{selectedRun.trigger}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Started</span>
                    <span className="text-white">{formatDate(selectedRun.startedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {selectedRun.error && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Error Details</h4>
                  <div className="p-3 bg-red-900/20 rounded text-sm text-red-400">
                    {selectedRun.error}
                  </div>
                </div>
              )}

              {/* Execution Logs */}
              {selectedRun.logs && selectedRun.logs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Execution Logs</h4>
                  <div className="max-h-48 overflow-y-auto bg-gray-900/50 rounded-lg p-3">
                    <div className="space-y-1">
                      {selectedRun.logs.map((log: any, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-xs">
                          {log.level === 'success' && <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />}
                          {log.level === 'error' && <XCircle className="w-3 h-3 text-red-400 mt-0.5" />}
                          {log.level === 'warning' && <AlertCircle className="w-3 h-3 text-yellow-400 mt-0.5" />}
                          {log.level === 'info' && <div className="w-3 h-3 rounded-full bg-gray-600 mt-0.5" />}
                          <span className="text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-gray-300 flex-1">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Screenshots */}
              {selectedRun.screenshots && selectedRun.screenshots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Screenshots ({selectedRun.screenshots.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRun.screenshots.map((screenshot: string, index: number) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedScreenshot(screenshot)}
                      >
                        <img
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <GlassButton variant="default" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Export Report
                </GlassButton>
                <GlassButton variant="default" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download Logs
                </GlassButton>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">Select a run to view details</p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedScreenshot}
              alt="Screenshot preview"
              className="w-auto h-auto max-w-full max-h-[90vh] rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedScreenshot(null)
              }}
              className="absolute top-4 right-4 p-2 bg-gray-900/90 rounded-lg hover:bg-gray-800 transition-all"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const link = document.createElement('a')
                link.href = selectedScreenshot
                link.download = `screenshot-${Date.now()}.png`
                link.click()
              }}
              className="absolute bottom-4 right-4 p-2 bg-gray-900/90 rounded-lg hover:bg-gray-800 transition-all"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}