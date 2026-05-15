import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextRequest, NextResponse } from "next/server"

export type UpdateReviewRequestBody = {
  rating: number
  comment: string
  levels: { id: number }[]
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 400 })

  if (!user) return NextResponse.json({ message: '認証が必要です' }, { status: 401 })

  const { id } = await params

  try {

    const dbUser = await prisma.user.findUnique({
      where: { supabaseUserId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const {  rating, comment, levels }: UpdateReviewRequestBody = await request.json()

    const data = await prisma.review.update({
      where: {
        id: Number(id),
      },
      data: {
        rating,
        comment,
      },
    })

    await prisma.reviewLevel.deleteMany({
      where: {
        reviewId: data.id,
      },
    })

    for (const level of levels) {
      await prisma.reviewLevel.create({
        data: {
          levelId: level.id,
          reviewId: data.id,
        },
      })
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 })
    
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, 
) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

if (error) return NextResponse.json({ message: error.message }, { status: 401 })

if (!user) return NextResponse.json({ message: '認証が必要です' }, { status: 401 })

  const { id } = await params

  try {
    await prisma.review.delete({
      where: {
        id: Number(id),
      },
    })

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
