import { weatherLabel } from "@/app/_libs/weatherLabel"
import { QualityType } from "@/app/generated/prisma/enums"

interface Props {
  date: string
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  snowfallSum: number
  snowQuality: string
  isToday: boolean
}

export const DailyWeatherCard: React.FC<Props> = ({ date, weatherCode, temperatureMax, temperatureMin, snowfallSum, snowQuality, isToday }) => {
  const [, month, day] = date.split('-')
  const formattedDate = `${Number(month)}/${Number(day)}`

  return (
    <div className={
      isToday
        ? "grid grid-cols-[56px_1fr_1fr_1fr_68px] items-center gap-1.5 px-2.5 py-2 bg-[#378ADD] rounded-md text-white"
        : "grid grid-cols-[56px_1fr_1fr_1fr_68px] items-center gap-1.5 px-2.5 py-2 bg-white rounded-md text-[#1E293B]"
    }>
      <span className="text-[11px]">{formattedDate}</span>
      <span className="text-xs text-center">{weatherLabel[weatherCode]}</span>
      <span className="text-xs text-center">{temperatureMin}/{temperatureMax}℃</span>
      <span className="text-xs text-center">{snowfallSum}cm</span>
      <span className={`text-[11px] text-right ${isToday ? '' : 'text-[#94A3B8]'}`}>
        {snowQuality ? snowQuality : 'ー'}
      </span>
    </div>
  )
}