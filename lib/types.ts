export type StockStatus = 'in_stock' | 'out_of_stock'

export interface ProductVariant {
  id: string
  product_id: string
  color: string
  quantity: number
  reserved_quantity: number
  source_text: string | null
  normalized_source_key: string | null
  created_at?: string
  updated_at?: string
}

export interface ProductPhoto {
  id: string
  product_id: string
  url: string
  is_primary: boolean
  sort_order: number
  created_at?: string
}

export interface Product {
  id: string
  code: string
  name: string
  description: string | null
  material: string | null
  size_text: string | null
  category: string | null
  price_retail: number
  price_drop: number
  is_active: boolean
  stock_status: StockStatus
  created_at?: string
  updated_at?: string
  product_variants?: ProductVariant[]
  product_photos?: ProductPhoto[]
}

export interface ProductStats {
  total: number
  inStock: number
  outOfStock: number
  active: number
}

export type ProductFilter =
  | 'all'
  | 'in_stock'
  | 'out_of_stock'
  | 'no_photo'
  | 'no_description'
  | 'no_retail'

export interface ImportReport {
  totalParsed: number
  productsCreated: number
  productsUpdated: number
  variantsCreated: number
  variantsUpdated: number
  expectedProductsCount: number
  activeProductsCount: number
  errors: string[]
}
