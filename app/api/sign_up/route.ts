import { prisma } from '@/app/_libs/prisma';
import { NextRequest, NextResponse } from "next/server"

export type CreateUserRequestBody = {
  name: string
  supabaseUserId: string
}

export type CreateUserResponse = {
  name: string
  supabaseUserId: string
}

export const POST = async (request: NextRequest) => {

  try {

    const body: CreateUserRequestBody = await request.json()

    const { name, supabaseUserId } = body

    const data = await prisma.user.create({
      data: {
        name,
        supabaseUserId,
      },
    })


    return NextResponse.json<CreateUserResponse>({
      name: data.name,
      supabaseUserId: data.supabaseUserId
    })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}