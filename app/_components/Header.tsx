'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from 'lucide-react'

type Props = {
  title?: string
  showBack?: boolean
}

export const Header = ({ title, showBack }: Props) => {
  const router = useRouter()

  return (
    <div className="bg-white h-14 px-5 flex items-center border-b border-gray-200">
      {showBack ? (
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#378ADD]">
          <ChevronLeft/>
          <span className="font-bold">{title}</span>
        </button>
      ) : (
        <Link href="/" className="text-xl font-bold">
          <span className="text-[#1A56A0]">Snow</span>
          <span className="text-[#378ADD]">Scope</span>
        </Link>
      )}
    </div>
  )
}