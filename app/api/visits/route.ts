import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextRequest, NextResponse } from "next/server"

export type CreateVisitResponse = {
  id: number
}

export const POST = async (request: NextRequest) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 401 })

  if (!user) return NextResponse.json({ message: '認証が必要です' }, { status: 401 })

  try {

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const { skiSpotId, visitedAt } = await request.json()

    const data = await prisma.visit.create({
      data: {
        userId: dbUser.id,
        skiSpotId: Number(skiSpotId),
        visitedAt: visitedAt
      }
    })

    return NextResponse.json<CreateVisitResponse>({ id: data.id })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}