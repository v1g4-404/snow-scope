import { prisma } from "@/app/_libs/prisma"
import { NextResponse } from "next/server"

export type LevelShowResponse = {
  levels: {
    id: number,
    name: string,
  }[]
}

export const GET = async () => {
  try {
    const levels = await prisma.level.findMany()

    return NextResponse.json<LevelShowResponse>({ levels }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}