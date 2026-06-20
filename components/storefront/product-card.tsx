import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

/** Product tile used on the homepage and category pages. */
export function ProductCard({ product }: { product: Product }) {
  const photos = product.product_photos ?? []
  const photo = photos.find((p) => p.is_primary) ?? photos[0]
  const inStock = product.stock_status === 'in_stock'

  return (
    <Link
      href={`/product/${product.id}`}
      className="group rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-stone-400 hover:shadow-md transition-all"
    >
      <div className="aspect-square bg-stone-100 relative overflow-hidden">
        {photo ? (
          <Image
            src={photo.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-300 text-5xl select-none">
            👜
          </div>
        )}
        {!inStock && (
          <span className="absolute top-2 left-2 bg-stone-800/80 text-white text-xs px-2 py-0.5 rounded-full">
            Немає
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-stone-900 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </p>
        {product.price_retail > 0 ? (
          <p className="text-base font-bold text-stone-900 mt-1">{product.price_retail} грн</p>
        ) : (
          <p className="text-sm text-stone-400 mt-1">Ціна за запитом</p>
        )}
      </div>
    </Link>
  )
}
