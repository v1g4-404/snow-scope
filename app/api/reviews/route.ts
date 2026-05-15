import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextRequest, NextResponse } from "next/server"

export type CreateReviewRequestBody = {
  skiSpotId: number
  rating: number
  comment: string
  levels: { id: number }[]
}

export type CreateReviewResponse = {
  id: number
}

export const POST = async (request: NextRequest) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 400 })

  if (!user) return NextResponse.json({ message: '認証が必要です' }, { status: 401 })

  try {

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const { skiSpotId, rating, comment, levels }: CreateReviewRequestBody = await request.json()

    const data = await prisma.review.create({
      data: {
        userId: dbUser.id,
        skiSpotId,
        rating,
        comment,
      },
    })

    await prisma.reviewLevel.createMany({
      data: levels.map((level) => ({
        levelId: level.id,
        reviewId: data.id,
      })),
    });

    return NextResponse.json<CreateReviewResponse>({ id: data.id, }, { status: 200 })
    
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}
