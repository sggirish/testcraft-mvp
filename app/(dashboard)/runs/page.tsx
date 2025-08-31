'use client'

import { useEffect, useState } from 'react'
import { 
  Play, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { formatDate } from '@/lib/utils'

export default function RunsPage() {
  const [runs, setRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRun, setSelectedRun] = useState<any>(null)

  useEffect(() => {
    fetchRuns()
  }, [])

  const fetchRuns = async () => {
    try {
      // Simulate fetching runs
      setTimeout(() => {
        setRuns([
          {
            id: '1',
            testName: 'Login Flow Test',
            projectName: 'E-commerce',
            status: 'passed',
            duration: 83000, // ms
            passed: 5,
            failed: 0,
            skipped: 0,
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            browser: 'Chrome',
            logs: [
              { step: 'Navigate to login page', status: 'passed', duration: '1.2s' },
              { step: 'Enter email', status: 'passed', duration: '0.5s' },
              { step: 'Enter password', status: 'passed', duration: '0.4s' },
              { step: 'Click login button', status: 'passed', duration: '0.8s' },
              { step: 'Verify dashboard loaded', status: 'passed', duration: '2.1s' },
            ]
          },
          {
            id: '2',
            testName: 'Checkout Process',
            projectName: 'E-commerce',
            status: 'failed',
            duration: 225000,
            passed: 8,
            failed: 2,
            skipped: 1,
            startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            browser: 'Firefox',
            error: 'Element not found: .checkout-button',
            logs: [
              { step: 'Add item to cart', status: 'passed', duration: '2.1s' },
              { step: 'Navigate to cart', status: 'passed', duration: '1.5s' },
              { step: 'Click checkout', status: 'failed', duration: '5.0s', error: 'Element not found' },
            ]
          },
          {
            id: '3',
            testName: 'User Registration',
            projectName: 'Marketing Site',
            status: 'running',
            duration: 45000,
            passed: 3,
            failed: 0,
            skipped: 0,
            startedAt: new Date(),
            browser: 'Safari',
          },
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching runs:', error)
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <GlassBadge variant="success">Passed</GlassBadge>
      case 'failed':
        return <GlassBadge variant="error">Failed</GlassBadge>
      case 'running':
        return <GlassBadge variant="info">Running</GlassBadge>
      default:
        return <GlassBadge variant="warning">Pending</GlassBadge>
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Test Runs</h1>
          <p className="text-gray-400 mt-2">
            View and manage test execution history
          </p>
        </div>
        <GlassButton onClick={fetchRuns} variant="primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </GlassButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Runs</p>
              <p className="text-2xl font-bold text-white">{runs.length}</p>
            </div>
            <Play className="h-8 w-8 text-purple-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Passed</p>
              <p className="text-2xl font-bold text-green-400">
                {runs.filter(r => r.status === 'passed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-400">
                {runs.filter(r => r.status === 'failed').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Running</p>
              <p className="text-2xl font-bold text-blue-400">
                {runs.filter(r => r.status === 'running').length}
              </p>
            </div>
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        </GlassCard>
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
            ) : (
              runs.map((run) => (
                <GlassCard
                  key={run.id}
                  variant="hover"
                  className={`p-4 cursor-pointer ${
                    selectedRun?.id === run.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedRun(run)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(run.status)}
                      <div>
                        <h3 className="font-semibold text-white">{run.testName}</h3>
                        <p className="text-sm text-gray-400">{run.projectName}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(run.duration)}
                          </span>
                          <span>{run.browser}</span>
                          <span>{formatDate(run.startedAt)}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(run.status)}
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
          {selectedRun ? (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{selectedRun.testName}</h3>
                {getStatusBadge(selectedRun.status)}
              </div>
              
              {/* Test Steps */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Test Results</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-400">
                      ✓ {selectedRun.passed} passed
                    </span>
                    {selectedRun.failed > 0 && (
                      <span className="text-red-400">
                        ✗ {selectedRun.failed} failed
                      </span>
                    )}
                    {selectedRun.skipped > 0 && (
                      <span className="text-yellow-400">
                        ⊘ {selectedRun.skipped} skipped
                      </span>
                    )}
                  </div>
                </div>

                {selectedRun.logs && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Execution Logs</h4>
                    <div className="space-y-2">
                      {selectedRun.logs.map((log: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            {log.status === 'passed' ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : log.status === 'failed' ? (
                              <XCircle className="h-4 w-4 text-red-400" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-400" />
                            )}
                            <span className="text-sm text-gray-300">{log.step}</span>
                          </div>
                          <span className="text-xs text-gray-500">{log.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRun.error && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Error Details</h4>
                    <div className="p-3 bg-red-900/20 rounded text-sm text-red-400">
                      {selectedRun.error}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <GlassButton variant="default" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    View Report
                  </GlassButton>
                  <GlassButton variant="default" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download Logs
                  </GlassButton>
                  {selectedRun.status === 'failed' && (
                    <GlassButton variant="primary" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Re-run Test
                    </GlassButton>
                  )}
                </div>
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
    </div>
  )
}