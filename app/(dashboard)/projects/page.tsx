'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Folder, ExternalLink, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassBadge } from '@/components/ui/glass-badge'
import { GlassSkeleton } from '@/components/ui/glass-skeleton'
import { CreateProjectModal } from '@/components/projects/create-project-modal'
import { EditProjectModal } from '@/components/projects/edit-project-modal'
import { DeleteProjectModal } from '@/components/projects/delete-project-modal'
import { useProjects } from '@/hooks/use-projects'
import { useModal } from '@/hooks/use-modal'
import { formatDate } from '@/lib/utils'

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, loading, fetchProjects } = useProjects()
  const { openModal, closeModal, isOpen } = useModal()
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEdit = (project: any) => {
    setSelectedProject(project)
    openModal('edit-project')
    setDropdownOpen(null)
  }

  const handleDelete = (project: any) => {
    setSelectedProject(project)
    openModal('delete-project')
    setDropdownOpen(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your testing projects
          </p>
        </div>
        <GlassButton onClick={() => openModal('create-project')}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </GlassButton>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <GlassSkeleton key={i} className="h-48" />
          ))
        ) : projects.length === 0 ? (
          // Empty state
          <div className="col-span-full">
            <GlassCard className="p-12 text-center">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to start testing
              </p>
              <GlassButton onClick={() => openModal('create-project')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </GlassButton>
            </GlassCard>
          </div>
        ) : (
          // Projects list
          projects.map((project) => (
            <GlassCard
              key={project.id}
              variant="hover"
              className="p-6 cursor-pointer relative"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <GlassButton
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDropdownOpen(dropdownOpen === project.id ? null : project.id)
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </GlassButton>
                  
                  {dropdownOpen === project.id && (
                    <div className="absolute right-0 mt-2 w-48 z-10">
                      <GlassCard className="p-1">
                        <button
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-foreground/5 rounded-lg w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(project)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-foreground/5 rounded-lg w-full text-left text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(project)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </GlassCard>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center">
                    <Folder className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:underline flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {new URL(project.url).hostname}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {project.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <GlassBadge>{project._count?.tests || 0} tests</GlassBadge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(project.createdAt)}
                </span>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isOpen('create-project')}
        onClose={() => closeModal('create-project')}
      />
      
      {selectedProject && (
        <>
          <EditProjectModal
            isOpen={isOpen('edit-project')}
            onClose={() => closeModal('edit-project')}
            project={selectedProject}
          />
          
          <DeleteProjectModal
            isOpen={isOpen('delete-project')}
            onClose={() => closeModal('delete-project')}
            project={selectedProject}
          />
        </>
      )}
    </div>
  )
}