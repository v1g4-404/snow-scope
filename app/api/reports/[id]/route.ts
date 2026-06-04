import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { CongestionType, OpenStatusType, QualityType } from "@/app/generated/prisma/enums"
import { NextRequest, NextResponse } from "next/server"

export type UpdateReportRequestBody = {
  snowQuality: QualityType,
  congestion: CongestionType,
  snowDepth: number,
  openStatus: OpenStatusType,
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 401 })

  if (!user) return NextResponse.json({ message: '認証が必要です' }, { status: 401 })

  const { id } = await params

  try {

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const { snowQuality, congestion, snowDepth, openStatus }: UpdateReportRequestBody = await request.json()

    await prisma.report.update({
      where: {
        id: Number(id),
        userId: dbUser.id,
      },
      data: {
        snowQuality,
        congestion,
        snowDepth,
        openStatus,
      },
    })

    return NextResponse.json({ message: 'OK' }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 401 })

  if (!user) return NextResponse.json({ message: '認証が必要です' }, { status: 401 })

  const { id } = await params

  try {

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    await prisma.report.delete({
      where: {
        id: Number(id),
        userId: dbUser.id
      },
    })

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export type RealTimeReportResponse = {
  snowQuality: QualityType | null,
  congestion: CongestionType | null,
  snowDepth: number | null,
  openStatus: OpenStatusType | null,
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {

  const { id } = await params

  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const snowDepth = await prisma.report.aggregate({
      _avg: {
        snowDepth: true,
      },
      where: {
        skiSpotId: Number(id),
        createdAt: { gte: todayStart, lte: todayEnd }
      },
    })

    const snowQuality = await prisma.report.groupBy({
      by: ["snowQuality"],
      _count: {
        snowQuality: true,
      },
      orderBy: {
        _count: {
          snowQuality: 'desc',
        },
      },
      where: {
        skiSpotId: Number(id),
        createdAt: { gte: todayStart, lte: todayEnd }
      },
      take: 1,
    })

    const congestion = await prisma.report.groupBy({
      by: ["congestion"],
      _count: {
        congestion: true,
      },
      orderBy: {
        _count: {
          congestion: 'desc',
        },
      },
      where: {
        skiSpotId: Number(id),
        createdAt: { gte: todayStart, lte: todayEnd }
      },
      take: 1,
    })

    const openStatus = await prisma.report.groupBy({
      by: ["openStatus"],
      _count: {
        openStatus: true,
      },
      orderBy: {
        _count: {
          openStatus: 'desc',
        },
      },
      where: {
        skiSpotId: Number(id),
        createdAt: { gte: todayStart, lte: todayEnd }
      },
      take: 1,
    })

    return NextResponse.json<RealTimeReportResponse>(
      { snowQuality: snowQuality[0]?.snowQuality, congestion: congestion[0]?.congestion, snowDepth: snowDepth._avg.snowDepth, openStatus: openStatus[0]?.openStatus },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}