// app/api/tests/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/tests/[id] - Get single test
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const test = await prisma.test.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        project: true,
        _count: {
          select: {
            runs: true,
          },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test' },
      { status: 500 }
    )
  }
}

// PUT /api/tests/[id] - Update test
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, steps, variables, tags } = body

    // Check if test exists and belongs to user
    const existingTest = await prisma.test.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingTest) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Update test and increment version
    const updatedTest = await prisma.test.update({
      where: { id: params.id },
      data: {
        name,
        description,
        steps,
        variables,
        tags,
        version: { increment: 1 },
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedTest)
  } catch (error) {
    console.error('Error updating test:', error)
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    )
  }
}

// DELETE /api/tests/[id] - Delete test
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if test exists and belongs to user
    const test = await prisma.test.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Delete test (cascade will handle runs and schedules)
    await prisma.test.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting test:', error)
    return NextResponse.json(
      { error: 'Failed to delete test' },
      { status: 500 }
    )
  }
}