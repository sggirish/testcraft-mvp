export const APP_NAME = 'TestCraft'
export const APP_DESCRIPTION = 'Visual test automation for everyone'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TESTS: '/tests',
  BUILDER: '/builder',
  RESULTS: '/results',
  SETTINGS: '/settings',
} as const

export const TEST_STEPS = {
  NAVIGATE: 'navigate',
  CLICK: 'click',
  TYPE: 'type',
  ASSERT: 'assert',
  WAIT: 'wait',
} as const

export const RUN_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  PASSED: 'passed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  ERROR: 'error',
} as const