'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { Package, Upload, Settings, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin/products', icon: Package, label: 'Товары' },
  { href: '/admin/import', icon: Upload, label: 'Импорт' },
  { href: '/admin/settings', icon: Settings, label: 'Настройки' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const isLogin = pathname === '/admin'

  useEffect(() => {
    let active = true
    async function check() {
      if (!supabase) {
        setLoading(false)
        return
      }
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!active) return
      setUser(user)
      setLoading(false)
      if (!user && !isLogin) router.replace('/admin')
      if (user && isLogin) router.replace('/admin/products')
    }
    check()
    const { data: sub } = supabase?.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    }) ?? { data: { subscription: { unsubscribe() {} } } }
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  async function logout() {
    await supabase?.auth.signOut()
    router.replace('/admin')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Загрузка…</div>
  }

  // Login page renders without the nav chrome
  if (isLogin) return <>{children}</>

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-20">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-hide">
            <span className="font-bold text-sm sm:text-base shrink-0 mr-2">JL Admin</span>
            {NAV.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors shrink-0',
                    active ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100 text-gray-700',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 shrink-0"
            title="Выйти"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </nav>
      <main className="container py-4 sm:py-8">{children}</main>
    </div>
  )
}
