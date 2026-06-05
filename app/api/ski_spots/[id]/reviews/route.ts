import { prisma } from "@/app/_libs/prisma"
import { NextRequest, NextResponse } from "next/server"

export type ReviewShowResponse = {
  reviews: {
    id: number
    userId: number
    skiSpotId: number
    rating: number
    comment: string
    createdAt: Date
    updatedAt: Date
    level: {
      id: number
      reviewId: number
      levelId: number
      level: {
        id: number
        name: string
        createdAt: Date
      }
    }[]
    user: {
      name: string
    }
  }[]
}

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {

  const { id } = await params

  try {
    const reviews = await prisma.review.findMany({
      where: {
        skiSpotId: Number(id),
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        level: {
          include: {
            level: true,
          },
        },
      },
    })

    return NextResponse.json<ReviewShowResponse>({ reviews }, { status: 200 })

  } catch (error) {

    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}