'use client'

import { Header } from "@/app/_components/Header";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { ReportForm, ReportFormValues } from "@/app/weather/_components/ReportForm";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export default function Page() {
  const router = useRouter()
  const { token } = useSupabaseSession()
  const { id } = useParams()

  const onSubmit: SubmitHandler<ReportFormValues> = async ({ snowQuality, congestion, snowDepth, openStatus }) => {

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ skiSpotId: Number(id), snowQuality, congestion, snowDepth, openStatus })
      })
      const data = await res.json()
      console.log(data)
      alert('作成しました')
      router.push(`/weather/${id}`)
    } catch (err) {
      alert('作成に失敗しました')
      console.log(err)
    }
  }

  return (
    <>
      <Header
        title="ゲレンデ天気"
        showBack={true}
      />
      <ReportForm
        mode="new"
        onSubmit={onSubmit}
      />
    </>
  )
}