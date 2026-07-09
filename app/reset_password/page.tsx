'use client'

import { SubmitHandler, useForm } from "react-hook-form"
import { ResetPassword } from "../_components/_types/Input"
import { useRouter } from "next/navigation"
import { AuthHeader } from "../_components/AuthHeader"
import { TextInput } from "../_components/TextInput"
import { Button } from '../_components/Button'
import { Label } from '../ski_spots/[id]/_components/Label'
import { supabase } from "../_libs/supabase"
import { useEffect } from "react"

export default function Page() {
  const { register, handleSubmit, getValues, formState: { isSubmitting, errors } } = useForm<ResetPassword>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  })
  const router = useRouter()

  useEffect(() => {
  const { token_hash, type } = Object.fromEntries(
    new URLSearchParams(window.location.search)
  )
  if (token_hash && type === 'recovery') {
    supabase.auth.verifyOtp({ token_hash, type: 'recovery' })
  }
}, [])

  const onSubmit: SubmitHandler<ResetPassword> = async ({ password }) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      alert('パスワードが短すぎます')
    } else {
      alert('パスワードを変更しました')
      router.replace('/sign_in')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">
      <AuthHeader subText="新しいパスワードを設定" />
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <Label htmlFor="password">新しいパスワード</Label>
            <TextInput
              {...register('password', {
                required: 'パスワードは必要です',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください'
                }
              })}
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              id='password'
            />
            {errors.password && <p className='mt-1 text-xs text-red-600'>{errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword">パスワード（確認）</Label>
            <TextInput
              {...register('confirmPassword', {
                required: '確認用パスワードは必要です',
                validate: (value) => value === getValues('password') || 'パスワードが一致しません'
              })}
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              id='confirmPassword'
            />
            {errors.confirmPassword && <p className='mt-1 text-xs text-red-600'>{errors.confirmPassword.message}</p>}
          </div>
          <Button type='submit' disabled={isSubmitting}>再設定する</Button>
        </form>
      </div>
    </div>
  )
}