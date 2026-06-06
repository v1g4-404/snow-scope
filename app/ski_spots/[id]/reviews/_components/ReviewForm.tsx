import { useFetch } from "@/app/_hooks/useFetch"
import { LevelShowResponse } from "@/app/api/levels/route"
import { SubmitHandler, useForm } from "react-hook-form"
import Select from "react-select"
import { Star } from "lucide-react";

export type ReviewFormValues = {
  levels: { id: number }[],
  rating: number,
  comment: string,
}

interface Props {
  mode: 'edit' | 'new',
  defaultValues?: ReviewFormValues,
  onSubmit: SubmitHandler<ReviewFormValues>,
  onDelete?: () => void,
}

export const ReviewForm: React.FC<Props> = ({
  mode, defaultValues, onSubmit, onDelete,
}) => {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm<ReviewFormValues>({ defaultValues })
  const levels = watch('levels') ?? []

  const { data } = useFetch<LevelShowResponse>('/api/levels')

  const levelsOptions = data?.levels ?? []

  const options = levelsOptions.map((level) => ({
    value: level.id,
    label: level.name,
  }))

  const selectedValues = options.filter((option) =>
    levels.some((c) => c.id === option.value)
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4 py-4 bg-white min-h-screen">
      <div>
        <label className="text-sm font-medium text-[#1E293B] mb-2 block">レベル別おすすめ</label>
        <Select
          instanceId="category-select"
          options={options}
          isMulti
          value={selectedValues}
          onChange={(selected) => setValue('levels', selected.map((s) => ({ id: s.value })))}
          placeholder="レベルを選択"
          styles={{
            option: (base) => ({ ...base, color: '#1E293B' }),
          }}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[#1E293B] mb-2 block">総合評価</label>
        {Array.from({ length: 5 }, (_, i) => (
          <button key={i} type="button" onClick={() => setValue('rating', i + 1)}>
            <Star
              size={24}
              fill={i < watch('rating') ? '#FBBF24' : 'none'}
              color={i < watch('rating') ? '#FBBF24' : '#D1D5DB'}
            />
          </button>
        ))}
        {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-[#1E293B] mb-2 block">コメント</label>
        <textarea
          {...register('comment', { required: 'コメントは必須です' })}
          className="w-full border border-[#CBD5E1] rounded-lg p-3 text-sm min-h-32 bg-white text-[#1E293B]"
          placeholder="テキストエリア用"
          disabled={isSubmitting}
        />
        {errors.comment && <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-[#378ADD] text-white rounded-lg p-3 text-sm font-medium"
        disabled={isSubmitting}
      >
        {mode === 'new' ? '投稿' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          className="w-full border border-red-400 text-red-400 rounded-lg p-3 text-sm font-medium"
          onClick={onDelete}
          disabled={isSubmitting}
        >
          削除
        </button>
      )}
    </form>
  )
}