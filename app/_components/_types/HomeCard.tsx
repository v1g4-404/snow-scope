import Link from "next/link";
import { Star } from 'lucide-react'

type Props = {
  id: number
  skiAreaName: string,
  prefecture: string | undefined,
  region: string,
  rating: number,
}

export const HomeCard = ({ id, skiAreaName, prefecture, region, rating }: Props) => {
  return (
    // HomeCard.tsx
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm w-40 flex-shrink-0">
      <Link href={`/ski_spots/${id}`}>
        <div className="bg-[#BFDBFE] h-32 w-full" />
        <div className="p-3">
          <div className="font-medium text-[#1E293B] text-sm">{skiAreaName}</div>
          <div className="text-xs text-[#64748B]">{prefecture} / {region}</div>
          <div className="flex mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < rating ? '#FBBF24' : 'none'}
                color={i < rating ? '#FBBF24' : '#D1D5DB'}
              />
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
