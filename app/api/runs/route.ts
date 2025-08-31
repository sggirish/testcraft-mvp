// app/api/runs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/runs - Get all test runs for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const testId = searchParams.get('testId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const runs = await prisma.testRun.findMany({
      where: {
        userId: session.user.id,
        ...(testId && { testId }),
      },
      include: {
        test: {
          select: {
            name: true,
            project: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.testRun.count({
      where: {
        userId: session.user.id,
        ...(testId && { testId }),
      },
    })

    return NextResponse.json({
      runs,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching test runs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test runs' },
      { status: 500 }
    )
  }
}