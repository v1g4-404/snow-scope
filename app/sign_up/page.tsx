'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { SignUpInput } from '../_components/_types/Input'
import { AuthHeader } from '../_components/AuthHeader'
import Link from 'next/link'
import { Label } from '../ski_spots/[id]/_components/Label'
import { TextInput } from '../_components/TextInput'
import { Button } from '../_components/Button'

export default function Page() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<SignUpInput>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  })


  const onSubmit: SubmitHandler<SignUpInput> = async ({ name, email, password }) => {
    try {
      const res = await fetch('/api/sign_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })
      if (!res.ok) {
        alert('登録に失敗しました')
        return
      }
      alert('登録が完了しました。')
    } catch (err) {
      alert('登録に失敗しました')
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8]">

      <AuthHeader subText="アカウントを作成" />

      <div className="px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <Label htmlFor='name'>ユーザーネーム</Label>
            <TextInput
              {...register('name', { required: 'ユーザーネームは必須です' })}
              type='text'
              placeholder='ユーザー名を入力'
              disabled={isSubmitting}
              id='name'
            />
            {errors.name && <p className='mt-1 text-xs text-red-600'>{errors.name.message}</p>}
          </div>
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
              placeholder='name@company.com'
              disabled={isSubmitting}
              id='email'
            />
            {errors.email && <p className='mt-1 text-xs text-red-600'>{errors.email.message}</p>}
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
              type='password'
              placeholder='••••••••'
              disabled={isSubmitting}
              id='password'
            />
            {errors.password && <p className='mt-1 text-xs text-red-600'>{errors.password.message}</p>}
          </div>
          <Button type='submit' disabled={isSubmitting}>登録</Button>
          <p className="text-center text-xs text-[#64748B]">
            すでにアカウントをお持ちの方は
            <Link href="/sign_in" className="text-[#378ADD]">ログイン</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
