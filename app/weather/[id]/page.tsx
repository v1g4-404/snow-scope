'use client'

import { useFetch } from "@/app/_hooks/useFetch";
import { WeatherShowResponse } from "@/app/api/weather/[id]/route";
import { useParams } from "next/navigation";
import { weatherLabel } from "@/app/_libs/weatherLabel";
import { Header } from "@/app/_components/Header";
import { WeatherInfoCard } from "../_components/WeatherInfoCard";
import { DailyWeatherCard } from "../_components/DailyWeatherCard";
import { ReportShowResponse } from "@/app/api/ski_spots/[id]/reports/route";
import Link from 'next/link';
import { UsersShowResponse } from "@/app/api/user/me/route";

export default function Page() {
  const { id } = useParams()
  const { data } = useFetch<WeatherShowResponse>(`/api/weather/${id}`)
  const { data: reportData } = useFetch<ReportShowResponse>(`/api/ski_spots/${id}/reports`)
  const { data: userData } = useFetch<UsersShowResponse>('/api/user/me')
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
  if (!data) return (<div>データが見つかりませんでした</div>)
  const currentInfoItems = [
    { label: '気温', value: `${data.current.temperatureMin}/${data.current.temperatureMax}°C` },
    { label: '天気', value: weatherLabel[data.current.weatherCode] },
    { label: '降雪量', value: `${data.current.snowfallSum}cm` },
    { label: '積雪', value: `${data.current.snowDepth}cm` },
  ]

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] pb-20">
      <Header showBack={true} title="天気" />
      <div className="bg-[#B5D4F4] px-4 py-3 text-[#1A56A0]">
        <h2 className="text-xl font-medium">{data.spot.name}</h2>
        <div className="text-[13px]">{data.spot.address}</div>
      </div>
      <div className="mx-4 mt-4 rounded-xl bg-[#E2E8F0] p-4">
        <h2 className="text-sm font-medium text-[#1E293B] mb-3">今日の天気</h2>
        <div className="grid grid-cols-2 gap-2">
          {currentInfoItems.map((item) => (
            <WeatherInfoCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
        <div className="bg-white rounded-lg p-3 text-center mt-2">
          <p className="text-xs text-[#64748B] mb-1">雪質（ユーザー投稿）</p>
          <p className="text-lg font-medium text-[#1E293B]">
            {data.current.snowQuality ? qualityLabel[data.current.snowQuality] : 'ー'}
          </p>
        </div>
      </div>
      <div className="mx-4 mt-4 rounded-xl bg-[#E2E8F0] p-4">
        <h2 className="text-sm font-medium text-[#1E293B] mb-3">週間データ（前後2日）</h2>
        <div className="flex flex-col gap-1.5">
          {data.daily.map((day) => (
            <DailyWeatherCard
              key={day.date}
              date={day.date}
              weatherCode={day.weatherCode}
              temperatureMax={day.temperatureMax}
              temperatureMin={day.temperatureMin}
              snowfallSum={day.snowfallSum}
              snowQuality={day.snowQuality ? qualityLabel[day.snowQuality] : 'ー'}
              isToday={day.date === new Date().toISOString().split('T')[0]}
            />
          ))}
        </div>
      </div>
      <div className="mx-4 mt-4 rounded-xl bg-[#E2E8F0] p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium text-[#1E293B]">レポート</h2>
        </div>
        {!reportData || reportData.reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-1">
            <p className="text-sm text-[#94A3B8]">レポートはまだありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reportData.reports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#1E293B]">{report.user.name}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {new Date(report.createdAt).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-[11px] text-[#64748B] mb-0.5">雪質</p>
                    <p className="text-xs font-medium text-[#1E293B]">{qualityLabel[report.snowQuality]}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#64748B] mb-0.5">積雪</p>
                    <p className="text-xs font-medium text-[#1E293B]">{report.snowDepth}cm</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#64748B] mb-0.5">混雑</p>
                    <p className="text-xs font-medium text-[#1E293B]">{congestionLabel[report.congestion]}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#64748B] mb-0.5">コース</p>
                    <p className="text-xs font-medium text-[#1E293B]">{openStatusLabel[report.openStatus]}</p>
                  </div>
                </div>
                {report.userId === userData?.user.id && (
                  <Link href={`/weather/${id}/reports/${report.id}`} className="self-end text-xs text-[#378ADD] border border-[#378ADD] rounded-full px-3 py-1">編集</Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mx-4 my-4">
        <Link href={`/weather/${id}/reports/new`} className="w-full bg-[#378ADD] text-white rounded-lg p-3 text-sm font-medium">現在の天候を投稿</Link>
      </div>
    </div>
  )
}