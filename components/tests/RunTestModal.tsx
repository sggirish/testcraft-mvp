// components/tests/RunTestModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Monitor,
  Eye,
  EyeOff,
  Chrome,
  Globe,
  FileText,
  Download,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { GlassModal } from '@/components/ui/glass-modal'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassBadge } from '@/components/ui/glass-badge'
import { cn } from '@/lib/utils'

interface RunTestModalProps {
  isOpen: boolean
  onClose: () => void
  testId: string
  testName: string
}

interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  step?: string
}

export function RunTestModal({ isOpen, onClose, testId, testName }: RunTestModalProps) {
  const router = useRouter()
  const [isRunning, setIsRunning] = useState(false)
  const [runComplete, setRunComplete] = useState(false)
  const [runResult, setRunResult] = useState<any>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [showLogs, setShowLogs] = useState(true)
  const [headless, setHeadless] = useState(true)
  const [browser, setBrowser] = useState('chrome')

  const runTest = async () => {
    setIsRunning(true)
    setRunComplete(false)
    setRunResult(null)
    setLogs([])
    setScreenshots([])

    try {
      const response = await fetch(`/api/tests/${testId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headless, browser }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRunResult(data.result)
        
        // Fetch full run details to get logs and screenshots
        const runResponse = await fetch(`/api/runs/${data.runId}`)
        if (runResponse.ok) {
          const runData = await runResponse.json()
          setLogs(runData.logs || [])
          setScreenshots(runData.screenshots || [])
        }
        
        setRunComplete(true)
      } else {
        setRunResult({
          status: 'FAILED',
          error: data.error || 'Test execution failed',
        })
        setRunComplete(true)
      }
    } catch (error: any) {
      console.error('Test run error:', error)
      setRunResult({
        status: 'ERROR',
        error: error.message || 'Failed to run test',
      })
      setRunComplete(true)
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = () => {
    if (!runResult) return null
    
    switch (runResult.status) {
      case 'PASSED':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'FAILED':
        return <XCircle className="w-6 h-6 text-red-400" />
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-400" />
    }
  }

  const getStatusColor = () => {
    if (!runResult) return ''
    
    switch (runResult.status) {
      case 'PASSED':
        return 'text-green-400'
      case 'FAILED':
        return 'text-red-400'
      default:
        return 'text-yellow-400'
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

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />
      case 'error':
        return <XCircle className="w-3 h-3 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-yellow-400" />
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-600" />
    }
  }

  const downloadScreenshot = (dataUrl: string, index: number) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `test-screenshot-${index + 1}.png`
    link.click()
  }

  return (
    <>
      <GlassModal
        isOpen={isOpen}
        onClose={onClose}
        title="Run Test"
        className="max-w-3xl"
        closeOnOverlayClick={!isRunning}
      >
        <div className="space-y-4">
          {/* Test Info */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Test Name</p>
              <p className="font-medium text-white">{testName}</p>
            </div>
            
            {!isRunning && !runComplete && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">Browser:</label>
                  <select
                    value={browser}
                    onChange={(e) => setBrowser(e.target.value)}
                    className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                  >
                    <option value="chrome">Chrome</option>
                    <option value="firefox">Firefox</option>
                    <option value="safari">Safari</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setHeadless(!headless)}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-sm transition-all"
                >
                  {headless ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Headless</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Visible</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Status Display */}
          {(isRunning || runComplete) && (
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isRunning ? (
                    <>
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                      <span className="text-lg font-medium text-white">Running test...</span>
                    </>
                  ) : (
                    <>
                      {getStatusIcon()}
                      <span className={cn("text-lg font-medium", getStatusColor())}>
                        Test {runResult?.status?.toLowerCase()}
                      </span>
                    </>
                  )}
                </div>
                
                {runResult && (
                  <div className="text-sm text-gray-400">
                    Duration: {formatDuration(runResult.duration)}
                  </div>
                )}
              </div>

              {runResult && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{runResult.passed || 0}</p>
                    <p className="text-xs text-gray-400">Passed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{runResult.failed || 0}</p>
                    <p className="text-xs text-gray-400">Failed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{runResult.skipped || 0}</p>
                    <p className="text-xs text-gray-400">Skipped</p>
                  </div>
                </div>
              )}

              {runResult?.error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
                  <p className="text-sm text-red-400">{runResult.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Logs Section */}
          {logs.length > 0 && (
            <div>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="flex items-center justify-between w-full p-3 bg-gray-800/30 hover:bg-gray-800/40 rounded-lg transition-all"
              >
                <span className="text-sm font-medium text-white">Execution Logs</span>
                {showLogs ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {showLogs && (
                <div className="mt-2 max-h-48 overflow-y-auto bg-gray-900/50 rounded-lg p-3">
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        {getLogIcon(log.level)}
                        <span className="text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-gray-300 flex-1">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Screenshots Section */}
          {screenshots.length > 0 && (
            <div>
              <p className="text-sm font-medium text-white mb-2">Screenshots</p>
              <div className="grid grid-cols-4 gap-2">
                {screenshots.map((screenshot, index) => (
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

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              {runComplete && (
                <>
                  <GlassButton
                    variant="default"
                    size="sm"
                    onClick={() => router.push('/runs')}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View All Runs
                  </GlassButton>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              {!isRunning && !runComplete && (
                <GlassButton
                  variant="primary"
                  onClick={runTest}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </GlassButton>
              )}
              
              {runComplete && (
                <GlassButton
                  variant="primary"
                  onClick={() => {
                    setRunComplete(false)
                    setRunResult(null)
                    setLogs([])
                    setScreenshots([])
                    runTest()
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Again
                </GlassButton>
              )}
              
              <GlassButton
                variant="ghost"
                onClick={onClose}
                disabled={isRunning}
              >
                Close
              </GlassButton>
            </div>
          </div>
        </div>
      </GlassModal>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
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
                downloadScreenshot(
                  selectedScreenshot,
                  screenshots.indexOf(selectedScreenshot)
                )
              }}
              className="absolute bottom-4 right-4 p-2 bg-gray-900/90 rounded-lg hover:bg-gray-800 transition-all"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}