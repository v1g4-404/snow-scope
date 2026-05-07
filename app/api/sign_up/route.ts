import { prisma } from '@/app/_libs/prisma';
import { supabaseAdmin } from '@/app/_libs/supabaseAdmin';
import { NextRequest, NextResponse } from "next/server"

export type CreateUserRequestBody = {
  name: string
  email: string
  password: string
}

export const POST = async (request: NextRequest) => {

  try {

    const body: CreateUserRequestBody = await request.json()
    const { name, email, password } = body

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      password: password,
    })

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        supabaseUserId: data.user.id,
      },
    })


    return NextResponse.json({
      name: user.name,
      supabaseUserId: user.supabaseUserId,
    })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}