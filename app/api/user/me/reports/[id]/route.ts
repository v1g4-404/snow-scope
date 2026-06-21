import { prisma } from "@/app/_libs/prisma"
import { CongestionType, OpenStatusType, QualityType } from "@/app/generated/prisma/enums"
import { NextResponse, NextRequest } from "next/server"

export type ReportByIdResponse = {
  report: {
    id: number
    userId: number
    skiSpotId: number
    snowQuality: QualityType
    congestion: CongestionType
    snowDepth: number
    openStatus: OpenStatusType
    createdAt: Date
    updatedAt: Date
    user: {
      name: string
    }
  } | null
}

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {

  const { id } = await params

  try {
    const report = await prisma.report.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
      },
    })

    return NextResponse.json<ReportByIdResponse>({ report }, { status: 200 })

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}