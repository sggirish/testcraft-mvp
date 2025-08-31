export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  theme?: 'light' | 'dark' | 'system'
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  slug: string
  description?: string | null
  url?: string | null
  settings?: Record<string, any>
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  _count?: {
    tests?: number
  }
}

export interface Test {
  id: string
  name: string
  description?: string | null
  steps: TestStep[]
  variables?: Record<string, any>
  assertions?: Assertion[]
  tags: string[]
  folder?: string | null
  version: number
  isDraft: boolean
  projectId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  lastRunAt?: Date | null
}

export interface TestStep {
  id: string
  type: 'navigate' | 'click' | 'type' | 'assert' | 'wait'
  name: string
  selector?: string
  value?: string
  url?: string
  duration?: number
  position: { x: number; y: number }
}

export interface Assertion {
  id: string
  type: 'text' | 'visibility' | 'url' | 'count'
  expected: string | number | boolean
  selector?: string
}

export interface TestRun {
  id: string
  status: 'queued' | 'running' | 'passed' | 'failed' | 'cancelled' | 'error'
  trigger: 'manual' | 'scheduled' | 'api' | 'ci_cd'
  startedAt: Date
  completedAt?: Date | null
  duration?: number | null
  passed: number
  failed: number
  skipped: number
  error?: string | null
  logs?: any[]
  screenshots?: string[]
  report?: any
  browser?: string | null
  viewport?: string | null
  testId: string
  userId: string
  scheduleId?: string | null
}