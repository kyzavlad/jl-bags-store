import type { MetadataRoute } from 'next'
import { getServiceSupabase } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/seo'

// Regenerate sitemap at most once per day.
export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPaths = ['/catalog', '/delivery-payment', '/wholesale', '/contacts', '/privacy', '/terms']
  const base: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...staticPaths.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
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

    // Query active products independently of nested photo joins. A failed
    // joined query previously returned no sitemap products even though the
    // storefront had live product pages. Keep the query paginated so Supabase
    // row limits cannot silently omit large catalogs.
    const productUrls: MetadataRoute.Sitemap = []
    const pageSize = 500
    for (let from = 0; ; from += pageSize) {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('is_active', true)
        .order('id', { ascending: true })
        .range(from, from + pageSize - 1)
      if (error) throw error
      for (const p of products ?? []) {
        productUrls.push({
          url: `${SITE_URL}/product/${p.id}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
      if (!products || products.length < pageSize) break
    }

    return [...base, ...categoryUrls, ...productUrls]
  } catch {
    // If DB is unreachable (e.g. during build without env), return just homepage.
    return base
  }
}
