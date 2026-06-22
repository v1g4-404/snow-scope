'use client'

import Link from 'next/link'
import { Home, Map, Cloud, Star, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const BottomNav = () => {
  const pathname = usePathname()

  const tabs = [
    { href: '/', label: 'ホーム', icon: Home },
    { href: '/ski_spots', label: 'ゲレンデ', icon: Map },
    { href: '/weather', label: '天気', icon: Cloud },
    { href: '/user/favorite', label: 'お気に入り', icon: Star },
    { href: '/user/profile', label: 'マイページ', icon: User },
  ]

  if (pathname === '/sign_in' || pathname === '/sign_up') return null

  return (
    <div className="fixed bottom-0 h-20.75 left-1/2 -translate-x-1/2 w-full max-w-97.5 flex justify-around bg-white border-t border-gray-200 py-2">
      {tabs.map((tab) => {
        const isActive = tab.href === '/'
          ? pathname === '/'
          : pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center text-xs flex-1 ${isActive ? 'text-[#378ADD]' : 'text-gray-400'}`}
          >
            <tab.icon size={24} className='pb-1' />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}