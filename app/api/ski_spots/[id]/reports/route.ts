import { prisma } from "@/app/_libs/prisma"
import { CongestionType, OpenStatusType, QualityType } from "@/app/generated/prisma/enums"
import { NextRequest, NextResponse } from "next/server"

export type ReportShowResponse = {
  reports: {
    id: number
    userId: number
    skiSpotId: number
    snowQuality: QualityType
    congestion: CongestionType
    snowDepth: number
    openStatus: OpenStatusType
    createdAt: Date
    updatedAt: Date
  }[]
}

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {

  const { id } = await params

  try {
    const reports = await prisma.report.findMany({
      where: {
        skiSpotId: Number(id)
      },
    })

    return NextResponse.json<ReportShowResponse>({ reports }, { status: 200 })

  } catch (error) {

    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }

}