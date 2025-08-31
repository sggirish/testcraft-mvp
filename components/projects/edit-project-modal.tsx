'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassModal } from '@/components/ui/glass-modal'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassTextarea } from '@/components/ui/glass-textarea'
import { projectSchema, type ProjectInput } from '@/lib/validations'
import { useProjects } from '@/hooks/use-projects'
import { useToast } from '@/hooks/use-toast'

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: any
}

export function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { updateProject } = useProjects()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      url: project?.url || '',
    },
  })

  useEffect(() => {
    reset({
      name: project?.name || '',
      description: project?.description || '',
      url: project?.url || '',
    })
  }, [project, reset])

  const onSubmit = async (data: ProjectInput) => {
    setIsLoading(true)
    
    const success = await updateProject(project.id, data)
    
    if (success) {
      addToast({
        title: 'Project updated',
        description: 'Your project has been updated successfully',
        type: 'success',
      })
      onClose()
    } else {
      addToast({
        title: 'Error',
        description: 'Failed to update project',
        type: 'error',
      })
    }
    
    setIsLoading(false)
  }

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      description="Update your project details"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Project Name</label>
          <GlassInput
            {...register('name')}
            placeholder="My Awesome Project"
            error={!!errors.name}
            disabled={isLoading}
            className="mt-1"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Description (Optional)</label>
          <GlassTextarea
            {...register('description')}
            placeholder="Describe your project..."
            error={!!errors.description}
            disabled={isLoading}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Base URL (Optional)</label>
          <GlassInput
            {...register('url')}
            type="url"
            placeholder="https://example.com"
            error={!!errors.url}
            disabled={isLoading}
            className="mt-1"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <GlassButton
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </GlassButton>
          <GlassButton type="submit" loading={isLoading}>
            Update Project
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  )
}