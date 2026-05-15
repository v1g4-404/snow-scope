import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextResponse, NextRequest } from "next/server"

export type UsersShowResponse = {
  user: {
    name: string
    visitCount: number
    postCount: number
    favoriteCount: number
  }
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
      include: {
        _count: {
          select: {
            visits: true,
            reviews: true,
            favorites: true,
            reports: true,
          }
        }
      }
    })

    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    const reviewCount = dbUser._count.reviews
    const reportCount = dbUser._count.reports
    const postCount = reviewCount + reportCount

    return NextResponse.json<UsersShowResponse>({
      user: {
        name: dbUser.name,
        visitCount: dbUser._count.visits,
        postCount,
        favoriteCount: dbUser._count.favorites,
      }
    }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export type UpdateUserRequestBody = {
  name: string
}

export const PUT = async (request: NextRequest) => {

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

    const { name }: UpdateUserRequestBody = await request.json()

    await prisma.user.update({
      where: {
        id: dbUser.id
      },
      data: {
        name,
      }
    })

    return NextResponse.json({ message: 'OK' }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}