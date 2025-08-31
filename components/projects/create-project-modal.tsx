'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { GlassModal } from '@/components/ui/glass-modal'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { GlassTextarea } from '@/components/ui/glass-textarea'
import { projectSchema, type ProjectInput } from '@/lib/validations'
import { useProjects } from '@/hooks/use-projects'
import { useToast } from '@/hooks/use-toast'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createProject } = useProjects()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: ProjectInput) => {
    setIsLoading(true)
    
    const project = await createProject(data)
    
    if (project) {
      addToast({
        title: 'Project created',
        description: 'Your project has been created successfully',
        type: 'success',
      })
      reset()
      onClose()
    } else {
      addToast({
        title: 'Error',
        description: 'Failed to create project',
        type: 'error',
      })
    }
    
    setIsLoading(false)
  }

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Create a new project to organize your tests"
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
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
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
          {errors.url && (
            <p className="text-sm text-red-500 mt-1">{errors.url.message}</p>
          )}
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
            Create Project
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  )
}