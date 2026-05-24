import { prisma } from "@/app/_libs/prisma"
import { NextRequest, NextResponse } from "next/server"

export type RecommendSpots = {
  recommendSpots: {
    id: number,
    areaId: number,
    name: string,
    reviews: {
      rating: number,
    }[]
    area: {
      name: string
      parent: {
        name: string
      } | null
    }
  }[]
}

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const ids = searchParams.get('ids')?.split(',').map(Number) ?? []

  try {
    const recommendSpots = await prisma.skiSpot.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include: {
        area: {
          select: {
            name: true,
            parent: {
              select: {
                name: true,
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true,
          }
        }
      }
    })

    return NextResponse.json<RecommendSpots>({ recommendSpots }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}