import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextResponse } from "next/server"

export type UsersShowResponse = {
  users: {
    id: number
    supabaseUserId: string
    name: string
    createdAt: Date
    updatedAt: Date
  }
}

export const GET = async () => {

  try {

    const { data: { user } } = await supabase.auth.getUser()


    if (!user) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 })
    }

    const users = await prisma.user.findUnique({
      where: {
        supabaseUserId: user.id,
      },
    })

    if (!users) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 })
    }

    return NextResponse.json<UsersShowResponse>({ users }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}