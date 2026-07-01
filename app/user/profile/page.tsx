'use client'

import { Header } from "@/app/_components/Header";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/app/_libs/supabase";
import { UpdateUserRequestBody, UsersShowResponse } from "@/app/api/user/me/route";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Mail, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { StatCard } from "../_components/StatCard";
import { ModalButton } from "@/app/_components/ModalButton";

export default function Page() {

  const router = useRouter()
  const { session, token } = useSupabaseSession()
  const { data, mutate, error } = useFetch<UsersShowResponse>(session ? '/api/user/me' : null)
  const [modaleOpen, setModalOpen] = useState(false)
  const [nameModalOpen, setNameModalOpen] = useState(false)
  const { register, handleSubmit } = useForm<UpdateUserRequestBody>({
    defaultValues: { name: data?.user?.name ?? '' }
  })

  useEffect(() => {
    if (session === null) {
      router.push('/sign_in')
    }
  }, [session, router])

  if (!session) return null
  if (error) return <div>エラーが発生しました</div>
  if (!data) return <div>読み込み中...</div>

  const onSubmit = async ({ name }: UpdateUserRequestBody) => {
    try {
      await fetch('/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!
        },
        body: JSON.stringify({ name })
      })
      alert('変更しました')
    } catch (err) {
      alert('変更に失敗しました')
      console.log(err)
    } finally {
      setNameModalOpen(false)
      mutate()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen w-full bg-white pb-20">
      <Header showBack={false} title="マイページ" />
      {nameModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-xs">
            <h3 className="font-medium text-[#1E293B] mb-4">ユーザー名を変更</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <input
                {...register('name', { required: 'ユーザーネームを入力してください' })}
                className="w-full border border-[#CBD5E1] rounded-lg p-3 text-sm text-[#1E293B]"
                placeholder="ユーザー名を入力"
              />
              <div className="flex gap-2">
                <ModalButton onClick={() => setNameModalOpen(false)} variant="cancel" label="キャンセル" />
                <ModalButton variant="confirm" label="変更" type="submit" />
              </div>
            </form>
          </div>
        </div>
      )}
      {modaleOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-xs">
            <p className="text-sm font-medium text-[#1E293B] mb-2">メールアドレス</p>
            <p className="text-sm text-[#64748B] mb-6">{session.user.email}</p>
            <ModalButton onClick={() => setModalOpen(false)} variant="cancel" label="閉じる" />
          </div>
        </div>
      )}
      <div className="px-5 pt-6 flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="口コミ投稿" value={data.user.postCount} />
          <StatCard label="お気に入り" value={data.user.favoriteCount} />
          <StatCard label="訪問回数" value={data.user.visitCount} />
        </div>

        <div className="border border-[#CBD5E1] rounded-xl overflow-hidden">
          <button
            onClick={() => setNameModalOpen(true)}
            className="w-full px-5 py-5 flex items-center justify-between bg-white"
          >
            <div className="flex items-center gap-4">
              <User size={20} className="text-[#64748B]" />
              <div className="text-left">
                <p className="text-xs text-[#64748B] mb-0.5">ユーザー名</p>
                <p className="text-base font-medium text-[#1E293B]">{data.user.name}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#94A3B8]" />
          </button>
          <div className="h-px bg-[#CBD5E1]" />
          <button
            onClick={() => setModalOpen(true)}
            className="w-full px-5 py-5 flex items-center justify-between bg-white"
          >
            <div className="flex items-center gap-4">
              <Mail size={20} className="text-[#64748B]" />
              <p className="text-base text-[#1E293B]">メールアドレス確認</p>
            </div>
            <ChevronRight size={18} className="text-[#94A3B8]" />
          </button>
          <div className="h-px bg-[#CBD5E1]" />
          <Link
            href="/reset_password"
            className="w-full px-5 py-5 flex items-center justify-between bg-white"
          >
            <div className="flex items-center gap-4">
              <Lock size={20} className="text-[#64748B]" />
              <p className="text-base text-[#1E293B]">パスワード変更</p>
            </div>
            <ChevronRight size={18} className="text-[#94A3B8]" />
          </Link>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full py-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-base font-medium"
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}