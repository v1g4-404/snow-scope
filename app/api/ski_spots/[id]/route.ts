import { AreaType, WidthType } from "@/app/generated/prisma/enums"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/app/_libs/prisma';
import { supabase } from "@/app/_libs/supabase";

export type SpotShowResponse = {
  spot: {
    id: number
    areaId: number
    name: string
    address: string
    latitude: number
    longitude: number
    courseCount: number
    maxSlope: number
    maxDistance: number
    courseWidth: WidthType
    beginnerRatio: number
    intermediateRatio: number
    advancedRatio: number
    ungroomedRatio: number
    groomedRatio: number
    openTime: string
    closeTime: string
    liftPrice: number
    parkingPrice: number
    hasSchool: boolean
    createdAt: Date
    updatedAt: Date
    area: {
      id: number
      parentId: number | null
      type: AreaType
      name: string
      createdAt: Date
      updatedAt: Date
    }
    isFavorite: boolean
  }
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {

  const token = request.headers.get('Authorization') ?? ''

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error) return NextResponse.json({ message: error.message }, { status: 401 })

  const { id } = await params
  let isFavorite = false

  try {

    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: {
          supabaseUserId: user.id,
        },
      })


      if (dbUser) {
        const favorite = await prisma.favorite.findUnique({
          where: {
            userId_skiSpotId: {
              userId: dbUser.id,
              skiSpotId: Number(id),
            },
          }
        })
        isFavorite = !!favorite
      }
    }

    const spot = await prisma.skiSpot.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        area: true,
      },
    })

    if (!spot) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 },
      )
    }

    return NextResponse.json<SpotShowResponse>({ spot: { ...spot, isFavorite } }, { status: 200 })

  } catch (error) {

    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })

  }
}
