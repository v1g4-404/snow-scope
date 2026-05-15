import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextResponse, NextRequest } from "next/server"

export type ReviewsShowResponse = {
  reviews: {
    id: number
    userId: number
    skiSpotId: number
    rating: number
    comment: string
    createdAt: Date
    updatedAt: Date
    level: {
      id: number
      reviewId: number
      levelId: number
      level: {
        id: number
        name: string
        createdAt: Date
      }
    }[]
  }[]
}


export const GET = async (request: NextRequest) => {
  
  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 401 })

  try {

    if (!user) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId: dbUser.id
      },
      include: {
        level: {
          include: {
            level: true,
          },
        },
      },
    })

    return NextResponse.json<ReviewsShowResponse>({ reviews }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}