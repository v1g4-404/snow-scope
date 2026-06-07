'use client'

import { Header } from "@/app/_components/Header";
import { ReviewForm, ReviewFormValues } from "../_components/ReviewForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation"
import { useFetch } from "@/app/_hooks/useFetch";
import { ReviewByIdResponse } from "@/app/api/user/me/reviews/[id]/route";

export default function Page() {
  const router = useRouter()
  const { token } = useSupabaseSession()
  const { id, reviewId } = useParams()

  const { data } = useFetch<ReviewByIdResponse>(`/api/user/me/reviews/${reviewId}`)

  const onSubmit: SubmitHandler<ReviewFormValues> = async ({ levels, rating, comment }) => {

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ skiSpotId: Number(id), levels, rating, comment })
      })
      const data = await res.json()
      console.log(data)
      alert('更新しました')
      router.push(`/ski_spots/${id}`)
    } catch (err) {
      alert('更新に失敗しました')
      console.log(err)
    }
  }

  const handleDelete = async () => {
    try {

      const res = await fetch(`/api/reviews/${reviewId}`, {
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
      router.push(`/ski_spots/${id}`)
    } catch (err) {
      alert('削除に失敗しました')
      console.log(err)
    }
  }

  if (!data) return <div>読み込み中...</div>

  const defaultValues: ReviewFormValues | undefined = data.review
    ? {
      levels: data.review.level.map((l) => ({ id: l.levelId })),
      rating: data.review.rating,
      comment: data.review.comment,
    }
    : undefined

  return (
    <>
      <Header
        title="口コミ編集"
        showBack={true}
      />
      <ReviewForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        onDelete={handleDelete}
      />
    </>
  )
}