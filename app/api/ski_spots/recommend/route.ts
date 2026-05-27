import { prisma } from "@/app/_libs/prisma"
import { NextResponse } from "next/server"

export type RecommendSpots = {
  beginnerSpots: {
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
  }[],
  intermediateSpots: {
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

export const GET = async () => {
  const beginnerIds = [15, 5, 2, 11]
  const intermediateIds = [13, 7, 9, 3]

  try {
    const beginnerSpots = await prisma.skiSpot.findMany({
      where: {
        id: {
          in: beginnerIds
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
    const intermediateSpots = await prisma.skiSpot.findMany({
      where: {
        id: {
          in: intermediateIds
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

    return NextResponse.json<RecommendSpots>({ beginnerSpots, intermediateSpots }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}