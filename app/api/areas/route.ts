import { prisma } from "@/app/_libs/prisma"
import { AreaType } from "@/app/generated/prisma/enums"
import { NextResponse } from "next/server"

export type AreasShowResponse = {
  areas: {
    id: number,
    parentId: number | null,
    type: AreaType,
    name: string,
  }[]
}

export const GET = async () => {

  try {
    const areas = await prisma.area.findMany()

    return NextResponse.json<AreasShowResponse>({ areas }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}