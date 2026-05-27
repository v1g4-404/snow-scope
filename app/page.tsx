'use client'

import { useState } from "react"
import { RecommendSpots } from "@/app/api/ski_spots/recommend/route"
import { HomeCard } from "./_components/HomeCard"
import { Header } from "./_components/Header"
import { SpotsIndexResponse } from "./api/ski_spots/route"
import { useFetch } from "./_hooks/useFetch"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const { data } = useFetch<SpotsIndexResponse>(`/api/ski_spots?query=${searchQuery}`)
  const { data: recommendData } = useFetch<RecommendSpots>(`/api/ski_spots/recommend`)

  if (!recommendData) return <div>読み込み中...</div>

  return (
    <div className="min-h-screen w-full bg-[#F0F4F8] pb-20">
      <Header />
      <div className="bg-[#4A90D9] px-4 h-24 flex items-center">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="エリア、雪質、斜度で検索…"
          className="w-full bg-white border border-[#CBD5E1] rounded-lg p-3 text-sm text-[#1E1E1E] placeholder:text-[#1E1E1E]"
        />
      </div>
      <div className="px-4 py-4">
        {searchQuery ? (
          <div>
            <h2 className="text-base font-medium text-[#1E293B] mb-3">検索結果</h2>
            <div className="flex flex-col gap-3">
              {data?.spots.map((spot: SpotsIndexResponse['spots'][number]) => (
                <HomeCard
                  key={spot.id}
                  id={spot.id}
                  skiAreaName={spot.name}
                  prefecture={spot.area.parent?.name}
                  region={spot.area.name}
                  rating={0}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-base font-medium text-[#1E293B] mb-3">初心者おすすめ</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendData.beginnerSpots.map((spot) => (
                  <HomeCard
                    key={spot.id}
                    id={spot.id}
                    skiAreaName={spot.name}
                    prefecture={spot.area.parent?.name}
                    region={spot.area.name}
                    rating={spot.reviews.length > 0
                      ? Math.round(spot.reviews.reduce((sum, review) => sum + review.rating, 0) / spot.reviews.length)
                      : 0
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-base font-medium text-[#1E293B] mb-3">中級者おすすめ</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendData.intermediateSpots.map((spot) => (
                  <HomeCard
                    key={spot.id}
                    id={spot.id}
                    skiAreaName={spot.name}
                    prefecture={spot.area.parent?.name}
                    region={spot.area.name}
                    rating={spot.reviews.length > 0
                      ? Math.round(spot.reviews.reduce((sum, review) => sum + review.rating, 0) / spot.reviews.length)
                      : 0
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}