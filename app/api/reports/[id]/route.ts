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