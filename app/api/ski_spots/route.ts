import { prisma } from '@/app/_libs/prisma'
import { NextResponse } from 'next/server'
import { WidthType, AreaType } from '@/app/generated/prisma/enums'
import { type NextRequest } from 'next/server'

export type SpotsIndexResponse = {
  spots: {
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
      parent: {
        name: string
      } | null
    }
  }[]
}

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const areaType = searchParams.get('areaType')

  try {
    const spots = await prisma.skiSpot.findMany({
      where: {
        ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
        ...(areaType ? { area: { type: areaType as AreaType } } : {}),
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

    return NextResponse.json<SpotsIndexResponse>({ spots }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}