'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Slide = {
  bg: string
  headline: string
  cta: string
  href: string
}

const SLIDES: Slide[] = [
  { bg: '/hero/hero-1.jpg', headline: 'ЖІНОЧІ СУМКИ',  cta: 'ПЕРЕГЛЯНУТИ КОЛЕКЦІЮ', href: '/catalog' },
  { bg: '/hero/hero-2.jpg', headline: 'НОВА КОЛЕКЦІЯ', cta: 'ОБРАТИ МОДЕЛЬ',         href: '/catalog' },
  { bg: '/hero/hero-3.jpg', headline: 'ПРЕМІУМ ЯКІСТЬ', cta: 'ПЕРЕЙТИ В КАТАЛОГ',    href: '/catalog' },
]

const LEFT_WORDS  = ['ПРЕМІУМ', 'ЖІНОЧІ', 'НОВА']
const RIGHT_WORDS = ['ЯКІСТЬ',  'СУМКИ',  'КОЛЕКЦІЯ']

export function HeroSlider() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const rect  = el.getBoundingClientRect()
        const total = el.offsetHeight - window.innerHeight
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1))
        const p = total > 0 ? scrolled / total : 0
        const next = p >= 0.66 ? 2 : p >= 0.33 ? 1 : 0
        setActive((prev) => (prev === next ? prev : next))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const slide = SLIDES[active]

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-neutral-900">

        {/* Background images (crossfade) */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out"
            style={{
              backgroundImage: `url('${s.bg}')`,
              opacity: i === active ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Full-height flex column layout — prevents overlap */}
        <div className="relative h-full flex flex-col items-center px-6 sm:px-10 py-12 sm:py-16">

          {/* ── Top: brand title ── */}
          <div className="text-center pointer-events-none select-none pt-2 sm:pt-0">
            <p
              className="font-light uppercase text-white/85 leading-tight"
              style={{ fontSize: 'clamp(1.1rem, 3vw, 2.5rem)', letterSpacing: '0.08em' }}
            >
              Julia Lebedeva<br />Collection
            </p>
          </div>

          {/* ── Middle: side words + headline + CTA ── */}
          <div className="flex-1 flex items-center w-full max-w-7xl mx-auto gap-4 sm:gap-8">

            {/* Left side words */}
            <div className="hidden sm:flex flex-col items-end gap-4 w-28 lg:w-36 shrink-0 text-right select-none">
              {LEFT_WORDS.map((w, i) => (
                <span
                  key={w}
                  className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase transition-all duration-500 ${
                    i === active ? 'text-white font-semibold' : 'text-white/30 font-light'
                  }`}
                >
                  {i === active ? `• ${w}` : w}
                </span>
              ))}
            </div>

            {/* Center: headline + CTA */}
            <div className="flex-1 text-center">
              <h1
                className="font-black uppercase text-white leading-none mb-8 sm:mb-10 transition-all duration-500"
                style={{ fontSize: 'clamp(2.2rem, 8vw, 6.5rem)', letterSpacing: '-0.02em' }}
              >
                {slide.headline}
              </h1>
              <Link
                href={slide.href}
                className="inline-block bg-white text-black text-xs sm:text-sm font-medium tracking-[0.2em] uppercase px-8 sm:px-12 py-3.5 sm:py-4 rounded-full hover:bg-neutral-200 transition-colors duration-300"
              >
                {slide.cta}
              </Link>
            </div>

            {/* Right side words */}
            <div className="hidden sm:flex flex-col items-start gap-4 w-28 lg:w-36 shrink-0 select-none">
              {RIGHT_WORDS.map((w, i) => (
                <span
                  key={w}
                  className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase transition-all duration-500 ${
                    i === active ? 'text-white font-semibold' : 'text-white/30 font-light'
                  }`}
                >
                  {i === active ? `${w} •` : w}
                </span>
              ))}
            </div>
          </div>

          {/* ── Bottom: progress indicator ── */}
          <div className="flex items-center gap-4 w-[min(420px,70vw)]">
            <span className="text-xs font-semibold tracking-widest text-white tabular-nums">
              {String(active + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 h-px bg-white/25 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white transition-all duration-500"
                style={{ width: `${((active + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold tracking-widest text-white/50 tabular-nums">
              {String(SLIDES.length).padStart(2, '0')}
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
