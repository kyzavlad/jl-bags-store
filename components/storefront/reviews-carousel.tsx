'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

/**
 * Auto-sliding reviews carousel with arrows + pagination dots.
 *
 * Review assets are PLACEHOLDERS. Drop real review screenshots at
 *   /public/reviews/review-1.jpg ... review-6.jpg
 * Cards gracefully show a neutral placeholder until the images exist.
 */

const REVIEWS = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: n,
  img: `/reviews/review-${n}.jpg`,
}))

const AUTOPLAY_MS = 4000

export function ReviewsCarousel() {
  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(1)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const pages = Math.max(1, REVIEWS.length - perView + 1)

  useEffect(() => {
    if (index > pages - 1) setIndex(pages - 1)
  }, [pages, index])

  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % pages)
    }, AUTOPLAY_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [pages])

  const go = (i: number) => setIndex(((i % pages) + pages) % pages)

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
        >
          {REVIEWS.map((r) => (
            <div
              key={r.id}
              className="shrink-0 px-3"
              style={{ width: `${100 / perView}%` }}
            >
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200">
                {/* Placeholder shown until a real review screenshot is dropped in */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-300">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs tracking-widest uppercase">Відгук {r.id}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.img}
                  alt={`Відгук клієнта ${r.id}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Попередній відгук"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center hover:bg-black hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Наступний відгук"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center hover:bg-black hover:text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Сторінка ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-black' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
