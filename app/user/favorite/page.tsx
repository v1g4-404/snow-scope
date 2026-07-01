'use client'

import { Header } from "@/app/_components/Header";
import { useFetch } from "@/app/_hooks/useFetch";
import { FavoriteShowResponse } from "@/app/api/user/me/favorites/route";
import Link from 'next/link'
import { Star } from "lucide-react"
import { useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const { data, mutate } = useFetch<FavoriteShowResponse>('/api/user/me/favorites')
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const { token } = useSupabaseSession()

  if (!data) return <div>読み込み中...</div>

  const onFavorite = async () => {
    await fetch(`/api/favorites/${deleteTargetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!
      },
    })
    setDeleteTargetId(null)
    mutate()
  }

  return (
    <div className="min-h-screen w-full bg-white pb-20">
      <Header showBack={true} title="お気に入り" />
      {deleteTargetId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-xs">
            <h3 className="font-medium text-[#1E293B] mb-2">お気に入りを解除しますか？</h3>
            <p className="text-xs text-[#64748B] mb-6">解除すると一覧から削除されます</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTargetId(null)} className="flex-1 border border-[#CBD5E1] rounded-lg p-3 text-sm text-[#64748B]">
                キャンセル
              </button>
              <button onClick={() => onFavorite()} className="flex-1 bg-red-400 text-white rounded-lg p-3 text-sm">
                解除
              </button>
            </div>
          </div>
        </div>
      )}
      {data.favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-1">
          <p className="text-sm text-[#94A3B8]">お気に入り登録しているゲレンデがありません</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-4 pt-4">
          {data.favorites.map((favorite) => (
            <Link
              key={favorite.id}
              href={`/weather/${favorite.skiSpot.id}`}
              className="bg-[#F1F5F9] rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-[#1E293B]">{favorite.skiSpot.name}</h3>
                <p className="text-sm text-[#94A3B8]">{favorite.skiSpot.address}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteTargetId(favorite.skiSpotId) }}>
                <Star size={20} fill={'#FBBF24'} color={'#FBBF24'} />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}