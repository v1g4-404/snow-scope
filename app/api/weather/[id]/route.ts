import { prisma } from "@/app/_libs/prisma";
import { QualityType } from "@/app/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

export type WeatherShowResponse = {
  spot: {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    address: string,
  }
  current: {
    temperatureMax: number,
    temperatureMin: number,
    weatherCode: number,
    snowfallSum: number,
    snowDepth: number,
    snowQuality: QualityType | null,
  }
  daily: {
    date: string,
    temperatureMax: number,
    temperatureMin: number,
    snowfallSum: number,
    weatherCode: number,
    snowQuality: QualityType | null,
  }[]
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {

  const { id } = await params


  try {
    const spot = await prisma.skiSpot.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, latitude: true, longitude: true, address: true }
    })
    if (!spot) {
      return NextResponse.json({ message: 'ゲレンデが見つかりません' }, { status: 404 })
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.latitude}&longitude=${spot.longitude}&hourly=snow_depth&daily=temperature_2m_max,temperature_2m_min,snowfall_sum,weather_code&past_days=2&forecast_days=3&timezone=auto`
    const res = await fetch(weatherUrl, {
      next: { revalidate: 1800 }
    })
    const weatherData = await res.json()
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const todayIndex = weatherData.daily.time.findIndex(
      (d: string) => d === today
    )
    const currentHour = `${now.toISOString().split('T')[0]}T${String(now.getHours()).padStart(2, '0')}:00`
    const hourlyIndex = weatherData.hourly.time.findIndex(
      (t: string) => t === currentHour
    )
    const reportDates = [-2, -1, 0].map(offset => {
      const d = new Date()
      d.setDate(d.getDate() + offset)
      return d.toISOString().split('T')[0]
    })
    const reportResults = await Promise.all(
      reportDates.map(async (date) => {
        const start = new Date(date)
        start.setHours(0, 0, 0, 0)
        const end = new Date(date)
        end.setHours(23, 59, 59, 999)

        const result = await prisma.report.groupBy({
          by: ['snowQuality'],
          _count: { snowQuality: true },
          where: {
            skiSpotId: Number(id),
            createdAt: { gte: start, lte: end }
          },
          orderBy: { _count: { snowQuality: 'desc' } },
          take: 1,
        })
        return { date, snowQuality: result[0]?.snowQuality ?? null }
      })
    )
    const current = {
      temperatureMax: weatherData.daily.temperature_2m_max[todayIndex],
      temperatureMin: weatherData.daily.temperature_2m_min[todayIndex],
      weatherCode: weatherData.daily.weather_code[todayIndex],
      snowfallSum: weatherData.daily.snowfall_sum[todayIndex],
      snowDepth: weatherData.hourly.snow_depth[hourlyIndex],
      snowQuality: reportResults.find(r => r.date === today)?.snowQuality ?? null,
    }
    const daily = weatherData.daily.time.map((date: string, index: number) => {
      const report = reportResults.find(r => r.date === date)
      return {
        date,
        temperatureMax: weatherData.daily.temperature_2m_max[index],
        temperatureMin: weatherData.daily.temperature_2m_min[index],
        snowfallSum: weatherData.daily.snowfall_sum[index],
        weatherCode: weatherData.daily.weather_code[index],
        snowQuality: report?.snowQuality ?? null,
      }
    })

    return NextResponse.json<WeatherShowResponse>({ spot, current, daily }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}