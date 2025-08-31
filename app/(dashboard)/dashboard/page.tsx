'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TestTube2, 
  FolderOpen, 
  Play, 
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Plus,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Zap
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setStats({
        projects: 3,
        tests: 24,
        runs: 156,
        passed: 142,
        failed: 14,
        avgDuration: '2m 34s',
        successRate: 91,
        weeklyChange: {
          tests: 12,
          runs: 23,
          successRate: 5
        },
        recentRuns: [
          { id: 1, name: 'Login Flow Test', project: 'E-commerce', status: 'passed', duration: '1m 23s', time: '2 hours ago' },
          { id: 2, name: 'Checkout Process', project: 'E-commerce', status: 'failed', duration: '3m 45s', time: '4 hours ago' },
          { id: 3, name: 'User Registration', project: 'Marketing Site', status: 'passed', duration: '2m 10s', time: '6 hours ago' },
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleNewProject = () => {
    router.push('/projects')
  }

  const handleNewTest = () => {
    router.push('/builder')
  }

  const handleRunTests = () => {
    router.push('/runs')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {session?.user?.name || 'User'}!
        </h1>
        <p className="text-gray-400 mt-2">
          Here's an overview of your testing activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Projects</p>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : stats?.projects}
              </p>
            </div>
            <div className="p-3 bg-purple-900/20 rounded-lg">
              <FolderOpen className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : stats?.tests}
              </p>
              {stats?.weeklyChange?.tests && (
                <p className="text-xs text-green-400 mt-1 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {stats.weeklyChange.tests}% this week
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-900/20 rounded-lg">
              <TestTube2 className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Test Runs</p>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : stats?.runs}
              </p>
              {stats?.weeklyChange?.runs && (
                <p className="text-xs text-green-400 mt-1 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {stats.weeklyChange.runs}% this week
                </p>
              )}
            </div>
            <div className="p-3 bg-green-900/20 rounded-lg">
              <Play className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : `${stats?.successRate}%`}
              </p>
              {stats?.weeklyChange?.successRate && (
                <p className="text-xs text-green-400 mt-1 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {stats.weeklyChange.successRate}% improvement
                </p>
              )}
            </div>
            <div className="p-3 bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Test Runs - 2 columns */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Recent Test Runs</h2>
            <div className="space-y-3">
              {loading ? (
                <>
                  <GlassSkeleton className="h-16 w-full" />
                  <GlassSkeleton className="h-16 w-full" />
                  <GlassSkeleton className="h-16 w-full" />
                </>
              ) : (
                stats?.recentRuns.map((run: any) => (
                  <div key={run.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center space-x-3">
                      {run.status === 'passed' ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <div>
                        <p className="font-medium text-white">{run.name}</p>
                        <p className="text-sm text-gray-400">{run.project} • {run.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-300">{run.duration}</p>
                      <p className={`text-xs ${run.status === 'passed' ? 'text-green-400' : 'text-red-400'}`}>
                        {run.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <GlassButton 
                variant="primary" 
                className="w-full justify-start"
                onClick={handleRunTests}
              >
                <Zap className="h-4 w-4 mr-2" />
                Run All Tests
              </GlassButton>
              <GlassButton 
                variant="default" 
                className="w-full justify-start"
                onClick={handleNewTest}
              >
                <TestTube2 className="h-4 w-4 mr-2" />
                Create New Test
              </GlassButton>
              <GlassButton 
                variant="default" 
                className="w-full justify-start"
                onClick={handleNewProject}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </GlassButton>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Test Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Passed Tests</span>
                  <span className="text-green-400">{stats?.passed || 0}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats?.successRate || 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Failed Tests</span>
                  <span className="text-red-400">{stats?.failed || 0}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${100 - (stats?.successRate || 0)}%` }}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Avg. Duration</span>
                  </div>
                  <span className="font-medium text-white">{stats?.avgDuration || '-'}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}