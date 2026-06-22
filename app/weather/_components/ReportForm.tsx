import { CongestionType, OpenStatusType, QualityType } from "@/app/generated/prisma/enums"
import { SubmitHandler, useForm } from "react-hook-form"

export type ReportFormValues = {
  snowQuality: QualityType,
  congestion: CongestionType,
  snowDepth: number,
  openStatus: OpenStatusType
}

interface Props {
  mode: 'edit' | 'new',
  defaultValues?: ReportFormValues,
  onSubmit: SubmitHandler<ReportFormValues>,
  onDelete?: () => void,
}

export const ReportForm: React.FC<Props> = ({
  mode, defaultValues, onSubmit, onDelete,
}) => {
  const qualityOptions = [
    { value: 'POWDER', label: 'パウダー' },
    { value: 'GROOMED', label: '圧雪' },
    { value: 'ICE', label: 'アイスバーン' },
    { value: 'SLUSH', label: 'ざらめ' },
  ]
  const congestionOptions = [
    { value: 'LOW', label: '少ない' },
    { value: 'NORMAL', label: '普通' },
    { value: 'HIGH', label: '混んでる' },
  ]
  const openStatusOptions = [
    { value: 'FULL', label: '全面滑走可' },
    { value: 'PARTIAL', label: '一部滑走可' },
    { value: 'CLOSED', label: 'クローズ' },
  ]

  const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm<ReportFormValues>({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4 py-4 bg-white min-h-screen">
      <div>
        <label className="text-sm font-medium text-[#1E293B] mb-2 block">雪質</label>
        <input type="hidden" {...register('snowQuality', { required: '雪質を選択してください' })} />
        <div className="flex flex-wrap gap-2">
          {qualityOptions.map((quality) => (
            <button
              key={quality.value}
              type="button"
              onClick={() => setValue('snowQuality', quality.value as QualityType)}
              className={`px-4 py-2 rounded-full text-sm ${
                watch('snowQuality') === quality.value
                  ? "bg-[#378ADD] text-white"
                  : "bg-[#F1F5F9] text-[#1E293B]"
              }`}
            >
              {quality.label}
            </button>
          ))}
        </div>
        {errors.snowQuality && <p className="mt-1 text-xs text-red-500">{errors.snowQuality.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-[#1E293B] mb-2 block">混雑度</label>
        <input type="hidden" {...register('congestion', { required: '混雑度を選択してください' })} />
        <div className="flex flex-wrap gap-2">
          {congestionOptions.map((congestion) => (
            <button
              key={congestion.value}
              type="button"
              onClick={() => setValue('congestion', congestion.value as CongestionType)}
              className={`px-4 py-2 rounded-full text-sm ${
                watch('congestion') === congestion.value
                  ? "bg-[#378ADD] text-white"
                  : "bg-[#F1F5F9] text-[#1E293B]"
              }`}
            >
              {congestion.label}
            </button>
          ))}
        </div>
        {errors.congestion && <p className="mt-1 text-xs text-red-500">{errors.congestion.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-[#1E293B] mb-2 block">積雪量（cm）</label>
        <input
          {...register('snowDepth', { required: '積雪量は必須です', valueAsNumber: true })}
          className="w-full border border-[#CBD5E1] rounded-lg p-3 text-sm bg-white text-[#1E293B]"
          placeholder="積雪量を入力"
          disabled={isSubmitting}
          type="number"
        />
        {errors.snowDepth && <p className="mt-1 text-xs text-red-500">{errors.snowDepth.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-[#1E293B] mb-2 block">コース状況</label>
        <input type="hidden" {...register('openStatus', { required: 'コース状況を選択してください' })} />
        <div className="flex flex-wrap gap-2">
          {openStatusOptions.map((openStatus) => (
            <button
              key={openStatus.value}
              type="button"
              onClick={() => setValue('openStatus', openStatus.value as OpenStatusType)}
              className={`px-4 py-2 rounded-full text-sm ${
                watch('openStatus') === openStatus.value
                  ? "bg-[#378ADD] text-white"
                  : "bg-[#F1F5F9] text-[#1E293B]"
              }`}
            >
              {openStatus.label}
            </button>
          ))}
        </div>
        {errors.openStatus && <p className="mt-1 text-xs text-red-500">{errors.openStatus.message}</p>}
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