// app/api/runs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/runs/[id] - Get single test run with details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const run = await prisma.testRun.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        test: {
          include: {
            project: true,
          },
        },
      },
    })

    if (!run) {
      return NextResponse.json({ error: 'Test run not found' }, { status: 404 })
    }

    return NextResponse.json(run)
  } catch (error) {
    console.error('Error fetching test run:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test run' },
      { status: 500 }
    )
  }
}

// DELETE /api/runs/[id] - Delete a test run
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const run = await prisma.testRun.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!run) {
      return NextResponse.json({ error: 'Test run not found' }, { status: 404 })
    }

    await prisma.testRun.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting test run:', error)
    return NextResponse.json(
      { error: 'Failed to delete test run' },
      { status: 500 }
    )
  }
}