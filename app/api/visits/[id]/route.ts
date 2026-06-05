import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

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

    await prisma.visit.delete({
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

export type VisitsBySpotResponse = {
  visitCount: number | null
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 401 })

  const { id } = await params

  try {

    if (!user) {
      return NextResponse.json<VisitsBySpotResponse>({ visitCount: null }, { status: 200 })
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const visitCount = await prisma.visit.count({
      where: {
        userId: dbUser.id,
        skiSpotId: Number(id)
      },
    })

    return NextResponse.json<VisitsBySpotResponse>({ visitCount }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}