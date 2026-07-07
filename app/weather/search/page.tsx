'use client'

import { Header } from "@/app/_components/Header"
import { useFetch } from "@/app/_hooks/useFetch"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { SpotsIndexResponse } from "@/app/api/ski_spots/route"
import { Star } from "lucide-react"
import Link from 'next/link'
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Suspense } from 'react'

function SearchContent() {
  const searchParams = useSearchParams()
  const areaId = searchParams.get('areaId')
  const { data, mutate } = useFetch<SpotsIndexResponse>(`/api/ski_spots?areaId=${areaId}`)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { token } = useSupabaseSession()

  const onFavorite = async (spot: SpotsIndexResponse['spots'][number]) => {
    if (!token) {
      setIsLoginModalOpen(true)
      return
    }

    if (!spot.isFavorite) {
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ skiSpotId: spot.id })
      })
    } else {
      await fetch(`/api/favorites/${spot.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
      })
    }
    mutate()
  }

  return (
    <div className="min-h-screen w-full bg-white pb-20">
      <Header showBack={false} />
      <div className="flex flex-col gap-4 px-4 pt-4">
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-xs">
              <h3 className="font-medium text-[#1E293B] mb-2">ログインが必要です</h3>
              <p className="text-xs text-[#64748B] mb-6">この操作にはログインが必要です</p>
              <div className="flex gap-2">
                <button onClick={() => setIsLoginModalOpen(false)} className="flex-1 border border-[#CBD5E1] rounded-lg p-3 text-sm text-[#64748B]">
                  キャンセル
                </button>
                <Link href='/sign_in' className="flex-1 bg-[#378ADD] text-white rounded-lg p-3 text-sm">ログインへ</Link>
              </div>
            </div>
          </div>
        )}
        {data?.spots.map((spot) => (
          <Link
            key={spot.id}
            href={`/weather/${spot.id}`}
            className="bg-[#F1F5F9] rounded-xl p-4 flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-medium text-[#1E293B]">{spot.name}</h3>
              <p className="text-sm text-[#94A3B8]">
                {spot.area.parent?.name} / {spot.area.name}
              </p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); onFavorite(spot) }}>
              <Star
                size={20}
                fill={spot.isFavorite ? '#FBBF24' : 'none'}
                color={spot.isFavorite ? '#FBBF24' : '#94A3B8'}
              />
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}