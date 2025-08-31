import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/tests - Get all tests for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const tests = await prisma.test.findMany({
      where: {
        userId: session.user.id,
        ...(projectId && { projectId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        project: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            runs: true,
          },
        },
      },
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}

// POST /api/tests - Create new test
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      projectId,
      steps,
      variables,
      tags 
    } = body

    // Validate required fields
    if (!name || !steps || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Invalid test data' },
        { status: 400 }
      )
    }

    // Get default project if not specified
    let finalProjectId = projectId
    if (!finalProjectId) {
      const defaultProject = await prisma.project.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'asc' },
      })
      finalProjectId = defaultProject?.id
    }

    if (!finalProjectId) {
      return NextResponse.json(
        { error: 'No project found' },
        { status: 400 }
      )
    }

    const test = await prisma.test.create({
      data: {
        name,
        description,
        steps: steps, // JSON field
        variables: variables || {},
        tags: tags || [],
        projectId: finalProjectId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    )
  }
}