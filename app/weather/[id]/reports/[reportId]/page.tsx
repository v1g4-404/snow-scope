'use client'

import { Header } from "@/app/_components/Header";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreateReportRequestBody } from "@/app/api/reports/route";
import { ReportByIdResponse } from "@/app/api/user/me/reports/[id]/route";
import { ReportForm, ReportFormValues } from "@/app/weather/_components/ReportForm";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export default function Page() {
  const router = useRouter()
  const { token } = useSupabaseSession()
  const { id, reportId } = useParams()

  const { data, error } = useFetch<ReportByIdResponse>(`/api/user/me/reports/${reportId}`)

  const onSubmit: SubmitHandler<ReportFormValues> = async ({ snowQuality, congestion, snowDepth, openStatus }) => {

    try {
      await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ skiSpotId: Number(id), snowQuality, congestion, snowDepth, openStatus } as CreateReportRequestBody)
      })
      alert('作成しました')
      router.push(`/weather/${id}`)
    } catch (err) {
      alert('作成に失敗しました')
      console.log(err)
    }
  }

  const handleDelete = async () => {
    try {

      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
      });
      if (!res.ok) {
        throw new Error('削除に失敗しました');
      }
      alert('削除しました')
      router.push(`/weather/${id}`)
    } catch (err) {
      alert('削除に失敗しました')
      console.log(err)
    }
  }

  if (error) return <div>エラーが発生しました</div>
  if (!data) return <div>読み込み中...</div>
  if (!data.report) return <div>投稿が見つかりません</div>

  const defaultValues: ReportFormValues = {
    snowQuality: data.report.snowQuality,
    congestion: data.report.congestion,
    snowDepth: data.report.snowDepth,
    openStatus: data.report.openStatus
  }

  return (
    <>
      <Header
        title="ゲレンデ天気"
        showBack={true}
      />
      <ReportForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onDelete={handleDelete}
      />
    </>
  )
}