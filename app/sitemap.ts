import type { MetadataRoute } from 'next'
import { getServiceSupabase } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/seo'

// Regenerate sitemap at most once per day.
export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  try {
    const supabase = getServiceSupabase()

    // Active category pages
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true)

    const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map((c: any) => ({
      url: `${SITE_URL}/catalog/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    // Active products that have at least one photo (worthwhile to index)
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at, product_photos(id)')
      .eq('is_active', true)

    const productUrls: MetadataRoute.Sitemap = (products ?? [])
      .filter((p: any) => ((p.product_photos as any[]) ?? []).length > 0)
      .map((p: any) => ({
        url: `${SITE_URL}/product/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

    return [...base, ...categoryUrls, ...productUrls]
  } catch {
    // If DB is unreachable (e.g. during build without env), return just homepage.
    return base
  }
}
