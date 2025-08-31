'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { GlassModal } from '@/components/ui/glass-modal'
import { GlassButton } from '@/components/ui/glass-button'
import { useProjects } from '@/hooks/use-projects'
import { useToast } from '@/hooks/use-toast'

interface DeleteProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
}

export function DeleteProjectModal({ isOpen, onClose, project }: DeleteProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { deleteProject } = useProjects()
  const { addToast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)
    
    const success = await deleteProject(project.id)
    
    if (success) {
      addToast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully',
        type: 'success',
      })
      onClose()
    } else {
      addToast({
        title: 'Error',
        description: 'Failed to delete project',
        type: 'error',
      })
    }
    
    setIsLoading(false)
  }

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Project"
      className="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm">
              Are you sure you want to delete <strong>{project?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. All tests and results associated with
              this project will be permanently deleted.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <GlassButton
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </GlassButton>
          <GlassButton
            variant="danger"
            onClick={handleDelete}
            loading={isLoading}
          >
            Delete Project
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  )
}