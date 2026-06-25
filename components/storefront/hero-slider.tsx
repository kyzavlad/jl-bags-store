'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/**
 * Scroll-controlled hero. The outer section is tall (260vh) and the inner
 * viewport-height container is sticky. As the user scrolls through the section,
 * scroll progress is mapped to 3 slides (crossfade) before the page continues.
 * Degrades gracefully on mobile (still sticky, still scroll-driven).
 *
 * Background images are placeholders: drop real photos at
 *   /public/hero/hero-1.jpg, /public/hero/hero-2.jpg, /public/hero/hero-3.jpg
 * Until then a deep neutral base + dark overlay is shown.
 */

type Slide = {
  bg: string
  headline: string
  cta: string
  href: string
}

const SLIDES: Slide[] = [
  { bg: '/hero/hero-1.jpg', headline: 'ЖІНОЧІ СУМКИ', cta: 'ПЕРЕГЛЯНУТИ КОЛЕКЦІЮ', href: '/catalog' },
  { bg: '/hero/hero-2.jpg', headline: 'НОВА КОЛЕКЦІЯ', cta: 'ОБРАТИ МОДЕЛЬ', href: '/catalog' },
  { bg: '/hero/hero-3.jpg', headline: 'ПРЕМІУМ ЯКІСТЬ', cta: 'ПЕРЕЙТИ В КАТАЛОГ', href: '/catalog' },
]

const LEFT_WORDS = ['ПРЕМІУМ', 'ЖІНОЧІ', 'НОВА']
const RIGHT_WORDS = ['ЯКІСТЬ', 'СУМКИ', 'КОЛЕКЦІЯ']

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
        const rect = el.getBoundingClientRect()
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
        {/* Background layers (crossfade) */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 bg-neutral-900 bg-cover bg-center transition-opacity duration-700 ease-out"
            style={{
              backgroundImage: `url('${s.bg}')`,
              opacity: i === active ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Top thin brand title */}
        <div className="absolute top-[14vh] left-0 right-0 px-6 text-center pointer-events-none select-none">
          <p
            className="font-light uppercase text-white/85 leading-[0.95]"
            style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)', letterSpacing: '0.04em' }}
          >
            Julia Lebedeva<br />Collection
          </p>
        </div>

        {/* 3-column content */}
        <div className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8 max-w-7xl mx-auto px-6 sm:px-10">
          {/* Left words */}
          <div className="hidden sm:flex flex-col items-end gap-4 text-right select-none">
            {LEFT_WORDS.map((w, i) => (
              <span
                key={w}
                className={`text-sm tracking-[0.35em] uppercase transition-all duration-500 ${
                  i === active ? 'text-white font-semibold' : 'text-white/30 font-light'
                }`}
              >
                {i === active ? `• ${w}` : w}
              </span>
            ))}
          </div>

          {/* Center */}
          <div className="text-center col-start-2">
            <h1
              className="font-black uppercase leading-none text-white mb-8 sm:mb-10 transition-all duration-500"
              style={{ fontSize: 'clamp(2.75rem, 10vw, 7.5rem)', letterSpacing: '-0.02em' }}
            >
              {slide.headline}
            </h1>
            <Link
              href={slide.href}
              className="inline-block bg-white text-black text-xs sm:text-sm font-medium tracking-[0.25em] uppercase px-8 sm:px-12 py-4 rounded-full hover:bg-neutral-200 transition-colors duration-300"
            >
              {slide.cta}
            </Link>
          </div>

          {/* Right words */}
          <div className="hidden sm:flex flex-col items-start gap-4 select-none">
            {RIGHT_WORDS.map((w, i) => (
              <span
                key={w}
                className={`text-sm tracking-[0.35em] uppercase transition-all duration-500 ${
                  i === active ? 'text-white font-semibold' : 'text-white/30 font-light'
                }`}
              >
                {i === active ? `${w} •` : w}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom progress indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 w-[min(420px,70vw)]">
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
    </section>
  )
}
