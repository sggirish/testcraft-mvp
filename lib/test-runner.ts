// lib/test-runner.ts
import { chromium, Browser, Page, BrowserContext } from 'playwright'
import { Test, TestRun, RunStatus } from '@prisma/client'

export interface TestStep {
  id: string
  type: string
  label: string
  value?: string
  selector?: string
  position?: { x: number; y: number }
}

export interface TestRunResult {
  success: boolean
  duration: number
  passed: number
  failed: number
  skipped: number
  error?: string
  logs: LogEntry[]
  screenshots: string[]
}

export interface LogEntry {
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  step?: string
  details?: any
}

export class TestRunner {
  private browser: Browser | null = null
  private context: BrowserContext | null = null
  private page: Page | null = null
  private logs: LogEntry[] = []
  private screenshots: string[] = []
  private startTime: number = 0

  constructor() {}

  async initialize(headless: boolean = true) {
    try {
      this.logs = []
      this.screenshots = []
      
      this.log('info', 'Initializing browser...')
      this.browser = await chromium.launch({
        headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
      
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'TestCraft/1.0',
        ignoreHTTPSErrors: true,
      })
      
      this.page = await this.context.newPage()
      
      // Set up console logging
      this.page.on('console', (msg) => {
        this.log('info', `Browser console: ${msg.text()}`)
      })
      
      // Set up error handling
      this.page.on('pageerror', (error) => {
        this.log('error', `Page error: ${error.message}`)
      })
      
      this.log('success', 'Browser initialized successfully')
    } catch (error: any) {
      this.log('error', `Failed to initialize browser: ${error.message}`)
      throw error
    }
  }

  async runTest(steps: TestStep[]): Promise<TestRunResult> {
    this.startTime = Date.now()
    let passed = 0
    let failed = 0
    let skipped = 0
    let currentStep: TestStep | null = null

    try {
      // Filter out start and end nodes, get only executable steps
      const executableSteps = steps.filter(
        step => step.type !== 'start' && step.type !== 'end'
      )

      this.log('info', `Starting test execution with ${executableSteps.length} steps`)

      for (const step of executableSteps) {
        currentStep = step
        
        try {
          this.log('info', `Executing step: ${step.label}`, step.id)
          
          switch (step.type) {
            case 'navigate':
              await this.executeNavigate(step)
              break
            
            case 'click':
              await this.executeClick(step)
              break
            
            case 'type':
              await this.executeType(step)
              break
            
            case 'assert':
              await this.executeAssert(step)
              break
            
            case 'wait':
              await this.executeWait(step)
              break
            
            default:
              this.log('warning', `Unknown step type: ${step.type}`, step.id)
              skipped++
              continue
          }
          
          passed++
          this.log('success', `Step completed: ${step.label}`, step.id)
          
          // Take screenshot after each successful step
          await this.takeScreenshot(`step-${step.id}`)
          
        } catch (stepError: any) {
          failed++
          this.log('error', `Step failed: ${step.label} - ${stepError.message}`, step.id)
          
          // Take error screenshot
          await this.takeScreenshot(`error-${step.id}`)
          
          // Stop execution on first failure
          throw new Error(`Test failed at step "${step.label}": ${stepError.message}`)
        }
      }

      const duration = Date.now() - this.startTime
      this.log('success', `Test completed successfully in ${duration}ms`)

      return {
        success: true,
        duration,
        passed,
        failed,
        skipped,
        logs: this.logs,
        screenshots: this.screenshots,
      }

    } catch (error: any) {
      const duration = Date.now() - this.startTime
      this.log('error', `Test execution failed: ${error.message}`)

      return {
        success: false,
        duration,
        passed,
        failed,
        skipped,
        error: error.message,
        logs: this.logs,
        screenshots: this.screenshots,
      }
    }
  }

  private async executeNavigate(step: TestStep) {
    if (!this.page) throw new Error('Page not initialized')
    if (!step.value) throw new Error('Navigate step requires a URL')

    const url = step.value.startsWith('http') ? step.value : `https://${step.value}`
    this.log('info', `Navigating to: ${url}`)
    
    await this.page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    
    await this.page.waitForLoadState('domcontentloaded')
  }

  private async executeClick(step: TestStep) {
    if (!this.page) throw new Error('Page not initialized')
    if (!step.value) throw new Error('Click step requires a selector')

    this.log('info', `Clicking element: ${step.value}`)
    
    // Wait for element to be visible and clickable
    await this.page.waitForSelector(step.value, {
      state: 'visible',
      timeout: 10000,
    })
    
    await this.page.click(step.value, {
      timeout: 10000,
    })
    
    // Wait for any navigation or network activity
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})
  }

  private async executeType(step: TestStep) {
    if (!this.page) throw new Error('Page not initialized')
    if (!step.selector) throw new Error('Type step requires a selector')
    if (!step.value) throw new Error('Type step requires text value')

    this.log('info', `Typing "${step.value}" into: ${step.selector}`)
    
    // Wait for element to be visible
    await this.page.waitForSelector(step.selector, {
      state: 'visible',
      timeout: 10000,
    })
    
    // Clear existing text first
    await this.page.fill(step.selector, '', { timeout: 10000 })
    
    // Type the new text
    await this.page.fill(step.selector, step.value, { timeout: 10000 })
  }

  private async executeAssert(step: TestStep) {
    if (!this.page) throw new Error('Page not initialized')
    if (!step.selector) throw new Error('Assert step requires a selector')

    this.log('info', `Asserting element: ${step.selector}`)
    
    // Check if element exists and is visible
    const element = await this.page.waitForSelector(step.selector, {
      state: 'visible',
      timeout: 10000,
    })
    
    if (!element) {
      throw new Error(`Element not found: ${step.selector}`)
    }
    
    // If there's an expected text value, verify it
    if (step.value) {
      const actualText = await element.textContent()
      if (!actualText?.includes(step.value)) {
        throw new Error(
          `Text assertion failed. Expected: "${step.value}", Actual: "${actualText}"`
        )
      }
      this.log('success', `Text assertion passed: "${step.value}"`)
    }
  }

  private async executeWait(step: TestStep) {
    const duration = step.value ? parseFloat(step.value) * 1000 : 1000
    this.log('info', `Waiting for ${duration}ms`)
    await new Promise(resolve => setTimeout(resolve, duration))
  }

  private async takeScreenshot(name: string): Promise<void> {
    if (!this.page) return

    try {
      const screenshot = await this.page.screenshot({
        fullPage: false,
        type: 'png',
      })
      
      // Convert to base64 for storage
      const base64 = screenshot.toString('base64')
      const dataUrl = `data:image/png;base64,${base64}`
      
      this.screenshots.push(dataUrl)
      this.log('info', `Screenshot captured: ${name}`)
    } catch (error: any) {
      this.log('warning', `Failed to capture screenshot: ${error.message}`)
    }
  }

  private log(
    level: 'info' | 'warning' | 'error' | 'success',
    message: string,
    step?: string,
    details?: any
  ) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      step,
      details,
    }
    
    this.logs.push(entry)
    
    // Also log to console for debugging
    const prefix = `[${level.toUpperCase()}]`
    console.log(`${prefix} ${message}`, details || '')
  }

  async cleanup() {
    try {
      if (this.page) await this.page.close()
      if (this.context) await this.context.close()
      if (this.browser) await this.browser.close()
      
      this.page = null
      this.context = null
      this.browser = null
      
      this.log('info', 'Browser cleanup completed')
    } catch (error: any) {
      this.log('error', `Cleanup error: ${error.message}`)
    }
  }
}