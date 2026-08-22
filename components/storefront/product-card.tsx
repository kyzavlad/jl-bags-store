import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  const photos = product.product_photos ?? []
  const photo = photos.find((p) => p.is_primary) ?? photos[0]
  const inStock = product.stock_status === 'in_stock'

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-[#efeae2]">
        {photo ? (
          <Image
            src={photo.url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-black/15 select-none">👜</div>
        )}

        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>

        {!inStock && (
          <div className="absolute inset-0 flex items-end bg-white/55 p-4 backdrop-blur-[1px]">
            <span className="rounded-full bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Немає в наявності
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="line-clamp-1 text-sm font-semibold text-[#171513]">{product.name}</p>
          <p className="mt-1 text-xs text-black/38">JL Bags · щоденний формат</p>
        </div>
        {product.price_retail > 0 ? (
          <p className="shrink-0 text-sm font-black text-[#171513]">{product.price_retail} грн</p>
        ) : (
          <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">
            За запитом
          </p>
        )}
      </div>
    </Link>
  )
}
