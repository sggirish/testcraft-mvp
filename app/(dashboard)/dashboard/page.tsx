'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { 
  TestTube2, 
  FolderOpen, 
  Play, 
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        projects: 3,
        tests: 24,
        runs: 156,
        passed: 142,
        failed: 14,
        avgDuration: '2m 34s',
        successRate: 91,
        recentRuns: [
          { id: 1, name: 'Login Flow Test', status: 'passed', duration: '1m 23s', time: '2 hours ago' },
          { id: 2, name: 'Checkout Process', status: 'failed', duration: '3m 45s', time: '4 hours ago' },
          { id: 3, name: 'User Registration', status: 'passed', duration: '2m 10s', time: '6 hours ago' },
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your testing activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Projects</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : stats?.projects}
              </p>
            </div>
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : stats?.tests}
              </p>
            </div>
            <TestTube2 className="h-8 w-8 text-muted-foreground" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Test Runs</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : stats?.runs}
              </p>
            </div>
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? <GlassSkeleton className="h-8 w-16" /> : `${stats?.successRate}%`}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Test Runs</h2>
          <div className="space-y-3">
            {loading ? (
              <>
                <GlassSkeleton className="h-16 w-full" />
                <GlassSkeleton className="h-16 w-full" />
                <GlassSkeleton className="h-16 w-full" />
              </>
            ) : (
              stats?.recentRuns.map((run: any) => (
                <div key={run.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5">
                  <div className="flex items-center space-x-3">
                    {run.status === 'passed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{run.name}</p>
                      <p className="text-sm text-muted-foreground">{run.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{run.duration}</p>
                    <p className="text-xs text-muted-foreground">{run.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">Test Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Passed Tests</span>
                <span className="text-green-500">{stats?.passed || 0}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats?.successRate || 0}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Failed Tests</span>
                <span className="text-red-500">{stats?.failed || 0}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${100 - (stats?.successRate || 0)}%` }}
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Avg. Duration</span>
                </div>
                <span className="font-medium">{stats?.avgDuration || '-'}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}