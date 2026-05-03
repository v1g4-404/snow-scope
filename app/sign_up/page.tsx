'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm, SubmitHandler } from 'react-hook-form'
import { SignUpInput } from '../_components/_types/Input'
import { AuthHeader } from '../_components/AuthHeader'
import Link from 'next/link'

export default function Page() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SignUpInput>()


  const onSubmit: SubmitHandler<SignUpInput> = async ({ name, email, password }) => {

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/user/profile`,

      },
    })
    if (error) {
      alert('登録に失敗しました')
    } else {
      alert('確認メールを送信しました。')
      const supabaseUserId = data?.user?.id
      try {
        const res = await fetch('/api/sign_up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, supabaseUserId })
        })
        const responseData = await res.json()
        console.log(responseData)
      } catch (err) {
        alert('登録に失敗しました')
        console.log(err)
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">

      <AuthHeader subText="アカウントを作成" />

      <div className="px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <label
              htmlFor='name'
              className="block mb-2 text-sm text-[#64748B]">
              ユーザーネーム
            </label>
            <input
              {...register('name', { required: 'ユーザーネームは必須です' })}
              type='text'
              placeholder='ユーザー名を入力'
              className='bg-white border border-[#CBD5E1] text-gray-900 text-sm rounded-lg block w-full p-2.5'
              disabled={isSubmitting}
              id='name'
            />
            {errors.name && <p className='mt-1 text-xs text-red-600'>{errors.name.message}</p>}
          </div>
          <div>
            <label
              htmlFor='email'
              className="block mb-2 text-sm text-[#64748B]">
              メールアドレス
            </label>
            <input
              {...register('email', {
                required: 'メールアドレスは必要です',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '正しいメールアドレスを入力してください'
                }
              })}
              type='email'
              placeholder='name@company.com'
              className='bg-white border border-[#CBD5E1] text-gray-900 text-sm rounded-lg block w-full p-2.5'
              disabled={isSubmitting}
              id='email'
            />
            {errors.email && <p className='mt-1 text-xs text-red-600'>{errors.email.message}</p>}
          </div>
          <div>
            <label
              htmlFor='password'
              className="block mb-2 text-sm text-[#64748B]">
              パスワード
            </label>
            <input
              {...register('password', {
                required: 'パスワードは必要です',
                minLength: {
                  value: 6,
                  message: 'パスワードは6文字以上で入力してください'
                }
              })}
              type='password'
              placeholder='••••••••'
              className='bg-white border border-[#CBD5E1] text-gray-900 text-sm rounded-lg block w-full p-2.5'
              disabled={isSubmitting}
              id='password'
            />
            {errors.password && <p className='mt-1 text-xs text-red-600'>{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full text-white bg-[#378ADD] hover:bg-[#1A56A0] font-medium rounded-lg text-sm px-5 py-3 mt-2"
            disabled={isSubmitting}
          >
            登録
          </button>
          <p className="text-center text-xs text-[#64748B]">
            すでにアカウントをお持ちの方は
            <Link href="/sign_in" className="text-[#378ADD]">ログイン</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
