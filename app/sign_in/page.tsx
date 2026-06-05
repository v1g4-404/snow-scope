'use client'

import { supabase } from '@/app/_libs/supabase'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { SignInInput } from '../_components/_types/Input'
import { AuthHeader } from '../_components/AuthHeader'
import Link from 'next/link'
import { TextInput } from '../_components/TextInput'
import { Button } from '../_components/Button'
import { Label } from '../ski_spots/[id]/_components/Label'

export default function Page() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SignInInput>({
    defaultValues: {
      email: '',
      password: '',
    }
  })
  const router = useRouter()

  const onSubmit: SubmitHandler<SignInInput> = async ({ email, password }) => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('ログインに失敗しました')
    } else {
      router.replace('/')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">

      <AuthHeader subText='ログイン' />

      <div className='px-6 py-8'>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <Label htmlFor='email'>メールアドレス</Label>
            <TextInput
              {...register('email', {
                required: 'メールアドレスは必要です',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '正しいメールアドレスを入力してください'
                }
              })}
              type='email'
              id='email'
              placeholder='name@company.com'
              disabled={isSubmitting}
            />
            {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor='password'>パスワード</Label>
            <TextInput
              {...register('password', {
                required: 'パスワードは必要です',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください'
                }
              })}
              placeholder='••••••••'
              disabled={isSubmitting}
              id='password'
              type='password'
            />
            {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
          </div>
          <Button type='submit' disabled={isSubmitting}>ログイン</Button>
          <p className='text-center text-xs text-[#64748B]'>
            <Link href="/reset_password" className="text-[#378ADD]">パスワードをお忘れですか？</Link>
          </p>
          <p className='text-center text-xs text-[#64748B]'>
            アカウントをお持ちでない方は
            <Link href="/sign_up" className="text-[#378ADD]">新規登録</Link>
          </p>
        </form>
      </div>
    </div>
  )
}