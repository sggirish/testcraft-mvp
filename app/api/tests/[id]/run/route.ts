// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import { TestRunner } from '@/lib/test-runner'

// // POST /api/tests/[id]/run - Execute a test
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const runner = new TestRunner()
  
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     // Get test details
//     const test = await prisma.test.findFirst({
//       where: {
//         id: params.id,
//         userId: session.user.id,
//       },
//     })

//     if (!test) {
//       return NextResponse.json({ error: 'Test not found' }, { status: 404 })
//     }

//     // Parse request body for execution options
//     const body = await request.json()
//     const { headless = true, browser = 'chrome' } = body

//     // Create test run record
//     const testRun = await prisma.testRun.create({
//       data: {
//         testId: test.id,
//         userId: session.user.id,
//         status: 'RUNNING',
//         browser,
//         trigger: 'MANUAL',
//         startedAt: new Date(),
//       },
//     })

//     // Initialize the test runner
//     await runner.initialize(headless)

//     // Execute the test
//     const result = await runner.runTest(test.steps as any[])

//     // Update test run with results
//     const updatedRun = await prisma.testRun.update({
//       where: { id: testRun.id },
//       data: {
//         status: result.success ? 'PASSED' : 'FAILED',
//         completedAt: new Date(),
//         duration: result.duration,
//         passed: result.passed,
//         failed: result.failed,
//         skipped: result.skipped,
//         error: result.error,
//         logs: JSON.stringify(result.logs),
//         screenshots: result.screenshots,
//       },
//     })

//     // Update test's lastRunAt
//     await prisma.test.update({
//       where: { id: test.id },
//       data: { lastRunAt: new Date() },
//     })

//     // Cleanup
//     await runner.cleanup()

//     return NextResponse.json({
//       success: true,
//       runId: updatedRun.id,
//       result: {
//         status: updatedRun.status,
//         duration: updatedRun.duration,
//         passed: updatedRun.passed,
//         failed: updatedRun.failed,
//         error: updatedRun.error,
//       },
//     })

//   } catch (error: any) {
//     console.error('Test execution error:', error)
    
//     // Cleanup on error
//     await runner.cleanup()
    
//     return NextResponse.json(
//       { 
//         error: 'Test execution failed',
//         details: error.message,
//       },
//       { status: 500 }
//     )
//   }
// }

// app/api/tests/[id]/run/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Simplified test runner for MVP (without actual Playwright execution)
// For full implementation, uncomment the TestRunner import and use it
import { TestRunner } from '@/lib/test-runner'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get test details
    const test = await prisma.test.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Parse request body for execution options
    const body = await request.json()
    const { headless = true, browser = 'chrome' } = body

    // Create test run record
    const testRun = await prisma.testRun.create({
      data: {
        testId: test.id,
        userId: session.user.id,
        status: 'RUNNING',
        browser,
        trigger: 'MANUAL',
        startedAt: new Date(),
      },
    })

    // Simulate test execution (replace with actual TestRunner when Playwright is set up)
    const simulateTestExecution = async () => {
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Parse steps
      const steps = test.steps as any[]
      const executableSteps = steps.filter(
        step => step.type !== 'start' && step.type !== 'end'
      )
      
      // Simulate execution logs
      const logs = executableSteps.map((step, index) => ({
        timestamp: new Date(Date.now() + index * 1000).toISOString(),
        level: 'success' as const,
        message: `Executed step: ${step.label}`,
        step: step.id,
      }))
      
      // Simulate some screenshots (using placeholder images)
      const screenshots = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      ]
      
      // Random success/failure for demo
      const success = Math.random() > 0.3
      
      return {
        success,
        duration: 2000 + Math.random() * 3000,
        passed: success ? executableSteps.length : executableSteps.length - 1,
        failed: success ? 0 : 1,
        skipped: 0,
        error: success ? undefined : 'Element not found: .submit-button',
        logs,
        screenshots,
      }
    }

    // Execute the test (simulated)
    const result = await simulateTestExecution()

    // Update test run with results
    const updatedRun = await prisma.testRun.update({
      where: { id: testRun.id },
      data: {
        status: result.success ? 'PASSED' : 'FAILED',
        completedAt: new Date(),
        duration: Math.round(result.duration),
        passed: result.passed,
        failed: result.failed,
        skipped: result.skipped,
        error: result.error,
        logs: result.logs,
        screenshots: result.screenshots,
      },
    })

    // Update test's lastRunAt
    await prisma.test.update({
      where: { id: test.id },
      data: { lastRunAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      runId: updatedRun.id,
      result: {
        status: updatedRun.status,
        duration: updatedRun.duration,
        passed: updatedRun.passed,
        failed: updatedRun.failed,
        error: updatedRun.error,
      },
    })

  } catch (error: any) {
    console.error('Test execution error:', error)
    
    return NextResponse.json(
      { 
        error: 'Test execution failed',
        details: error.message,
      },
      { status: 500 }
    )
  }
}