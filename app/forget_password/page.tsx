'use client'

import { SubmitHandler, useForm } from "react-hook-form"
import { ForgetPassword } from "../_components/_types/Input"
import { useRouter } from "next/navigation"
import { supabase } from "../_libs/supabase"
import { AuthHeader } from "../_components/AuthHeader"
import { TextInput } from "../_components/TextInput"
import { Button } from '../_components/Button'
import { Label } from '../ski_spots/[id]/_components/Label'
import Link from "next/link"

export default function Page() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ForgetPassword>({
    defaultValues: { email: '' }
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<ForgetPassword> = async ({ email }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset_password'
    })
    if (error) {
      alert('パスワードが存在しません')
    } else {
      alert('パスワードリセットメールを送信しました')
      router.replace('/sign_in')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">
      <AuthHeader subText="パスワードをお忘れの方" />
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <TextInput
              {...register('email', {
                required: 'メールアドレスは必要です',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '正しいメールアドレスを入力してください'
                }
              })}
              type="email"
              id="email"
              placeholder="name@company.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
          </div>
          <Button type='submit' disabled={isSubmitting}>送信する</Button>
          <p className='text-center text-xs text-[#64748B]'>
            <Link href="/sign_in" className="text-[#378ADD]">ログインに戻る</Link>
          </p>
        </form>
      </div>
    </div>
  )
}