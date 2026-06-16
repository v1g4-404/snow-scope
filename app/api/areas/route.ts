import { prisma } from "@/app/_libs/prisma"
import { AreaType } from "@/app/generated/prisma/enums"
import { NextRequest, NextResponse } from "next/server"

export type AreasShowResponse = {
  areas: {
    id: number,
    parentId: number | null,
    type: AreaType,
    name: string,
  }[]
}

export const GET = async (request: NextRequest) => {

  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const regionId = searchParams.get('regionId')

  try {
    let areas: AreasShowResponse['areas'] = []

    if (type) {
      areas = await prisma.area.findMany({
        where: { type: type as AreaType },
        select: { id: true, parentId: true, type: true, name: true }
      })
    }

    if (regionId) {
      const prefectures = await prisma.area.findMany({
        where: { type: 'PREFECTURE', parentId: Number(regionId) },
        select: { id: true, parentId: true, type: true, name: true, children: true }
      })

      const hasAreas = prefectures.some(p => p.children.length > 0)
      areas = hasAreas
        ? prefectures.flatMap(p => p.children)
        : prefectures
    }

    return NextResponse.json<AreasShowResponse>({ areas }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}