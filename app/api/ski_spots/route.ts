import { prisma } from '@/app/_libs/prisma'
import { NextResponse } from 'next/server'
import {  AreaType } from '@/app/generated/prisma/enums'
import { type NextRequest } from 'next/server'
import { supabase } from '@/app/_libs/supabase'

export type SpotsIndexResponse = {
  spots: {
    id: number
    areaId: number
    name: string
    address: string
    createdAt: Date
    updatedAt: Date
    area: {
      id: number
      parentId: number | null
      type: AreaType
      name: string
      createdAt: Date
      updatedAt: Date
      parent: {
        name: string
      } | null
    }
    isFavorite: boolean
  }[]
}

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const areaId = searchParams.get('areaId')
  const token = request.headers.get('Authorization') ?? ''
  const { data: { user } } = await supabase.auth.getUser(token)
  let favoriteSpotIds: number[] = []

  try {

    if (user) {
      const dbUser = await prisma.user.findUnique({ where: { supabaseUserId: user.id } })
      if (dbUser) {
        const favorites = await prisma.favorite.findMany({
          where: { userId: dbUser.id }
        })
        favoriteSpotIds = favorites.map(f => f.skiSpotId)
      }
    }

    const spots = await prisma.skiSpot.findMany({
      where: {
        ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
        ...(areaId ? { areaId: Number(areaId) } : {}),
      },
      include: {
        area: {
          include: {
            parent: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const spotsWithFavorite = spots.map(spot => ({
      ...spot,
      isFavorite: favoriteSpotIds.includes(spot.id)
    }))

    return NextResponse.json<SpotsIndexResponse>({ spots: spotsWithFavorite }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}