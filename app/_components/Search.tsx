'use client'

import { Header } from "./Header";
import { useFetch } from "../_hooks/useFetch";
import { AreasShowResponse } from "../api/areas/route";
import { useState } from "react";
import Link from 'next/link'

type Props = {
  type: 'ski_spots' | 'weather'
}

export const Search = ({ type }: Props) => {

  const [areaId, setAreaId] = useState<number | null>(null)
  const { data } = useFetch<AreasShowResponse>('/api/areas?type=REGION')
  const { data: searchData } = useFetch<AreasShowResponse>(
    areaId ? `/api/areas?regionId=${areaId}` : null
  )

  return (
    <>
      {areaId ? (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-xs max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-[#1E293B] mb-4">エリアを選択</h2>
            <div className="flex flex-col gap-2">
              {searchData?.areas.map((area) => (
                <Link
                  key={area.id}
                  href={`/${type}/search?areaId=${area.id}`}
                  className="w-full text-left px-4 py-3 rounded-lg bg-[#F1F5F9] text-[#1E293B] text-sm block"
                >
                  {area.name}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setAreaId(null)}
              className="w-full mt-4 py-3 text-sm text-[#64748B] border border-[#CBD5E1] rounded-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}
      <div className="min-h-screen w-full bg-[#378ADD] pb-20">
        <Header showBack={false} />
        <div className="flex flex-col gap-7 px-6 pt-6">
          {data?.areas.map((region) => (
            <button
              key={region.id}
              onClick={() => { setAreaId(region.id) }}
              className="w-full bg-white rounded-full py-4 text-[#1A56A0] font-medium text-base"
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}