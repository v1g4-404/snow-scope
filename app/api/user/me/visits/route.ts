import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"
import { NextResponse, NextRequest } from "next/server"

export type VisitsShowResponse = {
  visits: {
    id: number
    userId: number
    skiSpotId: number
    visitedAt: Date
  }[]
}

export const GET = async (request: NextRequest) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ status: error.message }, { status: 401 })

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
  
      const visits = await prisma.visit.findMany({
        where: {
          userId: dbUser.id
        },
      })
  
      return NextResponse.json<VisitsShowResponse>({ visits }, { status: 200 })
  
    } catch (error) {
      if (error instanceof Error)
        return NextResponse.json({ message: error.message }, { status: 400 })
    }
}