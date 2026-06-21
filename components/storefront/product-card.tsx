import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

/** Product tile — boutique minimal style. */
export function ProductCard({ product }: { product: Product }) {
  const photos = product.product_photos ?? []
  const photo = photos.find((p) => p.is_primary) ?? photos[0]
  const inStock = product.stock_status === 'in_stock'

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block"
    >
      {/* Image */}
      <div className="aspect-[3/4] bg-neutral-100 relative overflow-hidden mb-3">
        {photo ? (
          <Image
            src={photo.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-300 text-4xl select-none">
            👜
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-white/50 flex items-end p-3">
            <span className="text-xs tracking-widest uppercase text-neutral-600">Немає в наявності</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-sm text-neutral-800 line-clamp-1">{product.name}</p>
        {product.price_retail > 0 ? (
          <p className="text-sm font-semibold text-black mt-0.5">{product.price_retail} грн</p>
        ) : (
          <p className="text-xs text-neutral-400 mt-0.5 tracking-wider uppercase">Ціна за запитом</p>
        )}
      </div>
    </Link>
  )
}
