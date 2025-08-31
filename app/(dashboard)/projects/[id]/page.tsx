'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, TestTube2, Plus, Edit, Trash2, MoreVertical } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { GlassBadge } from '@/components/ui/glass-badge'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        addToast({
          title: 'Error',
          description: 'Project not found',
          type: 'error',
        })
        router.push('/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      addToast({
        title: 'Error',
        description: 'Failed to fetch project',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <GlassSkeleton className="h-12 w-64" />
        <GlassSkeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Project not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GlassButton
            variant="ghost"
            size="icon"
            onClick={() => router.push('/projects')}
          >
            <ArrowLeft className="h-5 w-5" />
          </GlassButton>
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            {project.description && (
              <p className="text-gray-400 mt-1">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <GlassButton onClick={() => router.push(`/builder/new?projectId=${project.id}`)} variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          New Test
        </GlassButton>
      </div>

      {/* Project Info */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Project Details</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-400">Base URL</p>
            <p className="font-medium text-white">
              {project.url || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Created</p>
            <p className="font-medium text-white">
              {formatDate(project.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="font-medium text-white">
              {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Tests */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Tests</h2>
          <GlassBadge>{project.tests?.length || 0} tests</GlassBadge>
        </div>
        
        {!project.tests || project.tests.length === 0 ? (
          <div className="text-center py-8">
            <TestTube2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 mb-4">
              No tests yet in this project
            </p>
            <GlassButton onClick={() => router.push(`/builder/new?projectId=${project.id}`)} variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create First Test
            </GlassButton>
          </div>
        ) : (
          <div className="space-y-2">
            {project.tests.map((test: any) => (
              <div
                key={test.id}
                className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-all flex items-center justify-between"
                onClick={() => router.push(`/builder/${test.id}`)}
              >
                <div>
                  <p className="font-medium text-white">{test.name}</p>
                  <p className="text-sm text-gray-400">
                    {test.steps?.length || 0} steps • Created {formatDate(test.createdAt)}
                  </p>
                </div>
                <GlassButton variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </GlassButton>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}