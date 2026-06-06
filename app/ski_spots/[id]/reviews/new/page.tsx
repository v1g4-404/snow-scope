'use client'

import { Header } from "@/app/_components/Header";
import { ReviewForm, ReviewFormValues } from "../_components/ReviewForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const { token } = useSupabaseSession()
  const { id } = useParams()

  const onSubmit: SubmitHandler<ReviewFormValues> = async ({ levels, rating, comment }) => {

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ skiSpotId: Number(id), levels, rating, comment })
      })
      const data = await res.json()
      console.log(data)
      alert('作成しました')
      router.push(`/ski_spots/${id}`)
    } catch (err) {
      alert('作成に失敗しました')
      console.log(err)
    }
  }


  return (
    <>
      <Header
        title="口コミ投稿"
        showBack={true}
      />
      <ReviewForm
        mode="new"
        onSubmit={onSubmit}
      />
    </>
  )
}