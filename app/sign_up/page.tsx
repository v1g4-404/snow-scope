'use client'

import { supabase } from '@/app/_libs/supabase'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from '../_components/_types/Input'

export default function Page() {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<Input>()


  const onSubmit: SubmitHandler<Input> = async ({ name, email, password }) => {

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
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100">
        <div>
          <label htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            ユーザーネーム
          </label>
          <input
            {...register('name', { required: 'ユーザーネームは必須です' })}
            type='name'
            id='name'
            placeholder='ユーザー名を入力'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            disabled={isSubmitting}
          />
          {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
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
            id='email'
            placeholder='name@company.com'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            disabled={isSubmitting}
          />
          {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
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
            id='password'
            placeholder='••••••••'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            disabled={isSubmitting}
          />
          {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
        </div>
        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}
