'use client'

import { useFetch } from "@/app/_hooks/useFetch";
import { SpotShowResponse } from "@/app/api/ski_spots/[id]/route";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/_components/Header";
import { BookmarkIcon, Star, StarIcon } from "lucide-react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useState } from "react";
import { VisitsBySpotResponse } from "@/app/api/visits/[id]/route";
import { RealTimeReportResponse } from "@/app/api/reports/[id]/route";
import { DonutChart } from "@/app/_components/DonutChart";
import { ReviewShowResponse } from "@/app/api/ski_spots/[id]/reviews/route";

export default function Page() {
  const { id } = useParams()
  const { data, mutate } = useFetch<SpotShowResponse>(`/api/ski_spots/${id}`)
  const { token } = useSupabaseSession()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visitedAt, setVisitedAt] = useState<string>('')
  const { data: visitData, mutate: mutatevisitData } = useFetch<VisitsBySpotResponse>(`/api/visits/${id}`)
  const { data: realTimeData } = useFetch<RealTimeReportResponse>(`/api/reports/${id}`)
  const { data: reviewData } = useFetch<ReviewShowResponse>(`/api/ski_spots/${id}/reviews`)

  const qualityLabel = {
    POWDER: 'パウダー',
    GROOMED: '圧雪',
    ICE: 'アイスバーン',
    SLUSH: 'ざらめ',
  }

  const congestionLabel = {
    LOW: '少ない',
    NORMAL: '普通',
    HIGH: '混んでる',
  }

  const openStatusLabel = {
    FULL: '全面滑走可',
    PARTIAL: '一部滑走可',
    CLOSED: 'クローズ',
  }

  const courseWidth = {
    NORMAL: '普通',
    WIDE: '広い',
    NARROW: '狭い',
  }

  const onFavorite = async () => {
    if (!token) {
      router.push('/sign_in')
      return
    }

    if (!data?.spot.isFavorite) {
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? ''
        },
        body: JSON.stringify({ skiSpotId: id })
      })
    } else {
      await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ?? ''
        },
      })
    }
    mutate()
  }

  const onVisit = async (date: string) => {
    if (!token) {
      router.push('/sign_in')
      return
    }
    if (!date) return

    await fetch("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ?? ''
      },
      body: JSON.stringify({ skiSpotId: id, visitedAt: new Date(date) })
    })
    mutatevisitData()
  }

  if (!data) return <div>読み込み中...</div>

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] pb-20">
      <Header
        title="ゲレンデ詳細"
        showBack={true}
      />
      <div className="bg-[#B5D4F4] px-4 py-3 flex flex-col justify-end pb-3 text-[#1A56A0] relative pr-24">
        <h2 className="text-xl font-medium">{data.spot.name}</h2>
        <div className="text-[13px]">{data.spot.area.parent?.name} / {data.spot.area.name}</div>
        <div className="absolute bottom-3 right-4 flex gap-2">
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-xs">
                <h3 className="font-medium text-[#1E293B] mb-4">訪問日を選択</h3>
                <input
                  type="date"
                  value={visitedAt}
                  onChange={(e) => setVisitedAt(e.target.value)}
                  className="w-full border border-[#CBD5E1] rounded-lg p-3 mb-4"
                />
                <div className="flex gap-2">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 border border-[#CBD5E1] rounded-lg p-3">
                    キャンセル
                  </button>
                  <button onClick={() => { onVisit(visitedAt); setIsModalOpen(false) }} className="flex-1 bg-[#378ADD] text-white rounded-lg p-3">
                    登録
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center">
            {visitData?.visitCount !== null && (
              <span className="text-sm font-medium text-[#1A56A0]">{visitData?.visitCount}</span>
            )}
            <button onClick={() => setIsModalOpen(true)} className="bg-white rounded-full p-2">
              <BookmarkIcon size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium invisible">&nbsp;</span>
            <button onClick={onFavorite} className="bg-white rounded-full p-2">
              <StarIcon size={20}
                fill={data.spot.isFavorite ? '#FBBF24' : 'none'}
                color={data.spot.isFavorite ? '#FBBF24' : '#64748B'}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="mx-4 mt-4 rounded-xl bg-[#E2E8F0] p-4">
        <h2 className="text-sm font-medium text-[#1E293B] mb-3">
          <span className="text-green-500">・</span> リアルタイム情報
        </h2>
        {!realTimeData || realTimeData.snowQuality === null || realTimeData.congestion === null || realTimeData.openStatus === null ? (
          <div className="flex flex-col items-center justify-center py-6 gap-1">
            <p className="text-sm text-[#94A3B8]">本日の情報はまだありません</p>
            <p className="text-xs text-[#CBD5E1]">ゲレンデからのレポートをお待ちください</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xs text-[#64748B]">雪質</p>
              <p className="text-sm font-medium text-[#1E293B]">{qualityLabel[realTimeData.snowQuality]}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">積雪</p>
              <p className="text-sm font-medium text-[#1E293B]">{realTimeData.snowDepth}cm</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">混雑</p>
              <p className="text-sm font-medium text-[#1E293B]">{congestionLabel[realTimeData.congestion]}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">コース</p>
              <p className="text-sm font-medium text-[#1E293B]">{openStatusLabel[realTimeData.openStatus]}</p>
            </div>
          </div>
        )}
      </div>
      <div className="mx-4 mt-4 rounded-xl bg-[#E2E8F0] p-4">
        <h2 className="text-sm font-medium text-[#1E293B] mb-3">コース情報</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-[#64748B]">コース数</p>
            <p className="text-lg font-medium text-[#1E293B]">{data.spot.courseCount}コース</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-[#64748B]">最長滑走距離</p>
            <p className="text-lg font-medium text-[#1E293B]">{data.spot.maxDistance}m</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-[#64748B]">最大斜度</p>
            <p className="text-lg font-medium text-[#1E293B]">{data.spot.maxSlope}°</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-[#64748B]">コース幅</p>
            <p className="text-lg font-medium text-[#1E293B]">{courseWidth[data.spot.courseWidth]}</p>
          </div>
        </div>
        <DonutChart
          beginnerRatio={data.spot.beginnerRatio}
          intermediateRatio={data.spot.intermediateRatio}
          advancedRatio={data.spot.advancedRatio}
          groomedRatio={data.spot.groomedRatio}
          ungroomedRatio={data.spot.ungroomedRatio}
        />
      </div>
      <div className="mx-4 mt-4 rounded-xl bg-[#E2E8F0] p-4">
        <h2 className="text-sm font-medium text-[#1E293B] mb-3">基本情報</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-xs text-[#64748B]">場所</p>
            <p className="text-xs text-[#1E293B]">{data.spot.address}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-[#64748B]">営業時間</p>
            <p className="text-xs text-[#1E293B]">{data.spot.openTime}〜{data.spot.closeTime}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-[#64748B]">リフト料金</p>
            <p className="text-xs text-[#1E293B]">¥{data.spot.liftPrice.toLocaleString()}/日</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-[#64748B]">駐車場</p>
            <p className="text-xs text-[#1E293B]">¥{data.spot.parkingPrice.toLocaleString()}/日</p>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-[#64748B]">スクール</p>
            <p className="text-xs text-[#1E293B]">{data.spot.hasSchool ? 'あり（要予約）' : 'なし'}</p>
          </div>
        </div>
      </div>
      <div className="mx-4 mt-4 rounded-xl bg-[#E2E8F0] p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium text-[#1E293B]">口コミ</h2>
        </div>
        {!reviewData || reviewData.reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-1">
            <p className="text-sm text-[#94A3B8]">口コミはまだありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reviewData.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#1E293B]">{review.user.name}</p>
                  <div className="flex gap-0.5">
                    {review.level.map(l => (
                      <span key={l.id} className="text-xs bg-[#378ADD] text-white px-2 py-0.5 rounded-full">
                        {l.level.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < review.rating ? '#FBBF24' : 'none'}
                      color={i < review.rating ? '#FBBF24' : '#D1D5DB'}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#64748B]">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}