'use client'

import { create } from 'zustand'
import { Project } from '@/types'
import { useToast } from './use-toast'

interface ProjectsStore {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  
  fetchProjects: () => Promise<void>
  fetchProject: (id: string) => Promise<void>
  createProject: (data: any) => Promise<Project | null>
  updateProject: (id: string, data: any) => Promise<boolean>
  deleteProject: (id: string) => Promise<boolean>
  setCurrentProject: (project: Project | null) => void
}

export const useProjects = create<ProjectsStore>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      set({ projects: data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  fetchProject: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) throw new Error('Failed to fetch project')
      const data = await response.json()
      set({ currentProject: data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  createProject: async (data: any) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create project')
      const project = await response.json()
      set((state) => ({
        projects: [project, ...state.projects],
        loading: false,
      }))
      return project
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return null
    }
  },

  updateProject: async (id: string, data: any) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update project')
      
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
        currentProject:
          state.currentProject?.id === id
            ? { ...state.currentProject, ...data }
            : state.currentProject,
        loading: false,
      }))
      return true
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return false
    }
  },

  deleteProject: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete project')
      
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject:
          state.currentProject?.id === id ? null : state.currentProject,
        loading: false,
      }))
      return true
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return false
    }
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project })
  },
}))