import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextResponse } from "next/server"

export type FavoriteShowResponse = {
  favorites: {
    id: number
    userId: number
    skiSpotId: number
    createdAt: Date
  }[]
}

export const GET = async () => {

  try {

    const { data: { user } } = await supabase.auth.getUser()


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

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: dbUser.id
      },
    })

    return NextResponse.json<FavoriteShowResponse>({ favorites }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}