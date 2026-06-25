export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jl-bags-store.vercel.app'
).replace(/\/$/, '')

export const BRAND = {
  name: 'JL Bags',
  collection: 'Julia Lebedeva Collection',
  phone: '+380957427720',
  phoneDisplay: '0957427720',
  city: 'Харків',
  region: 'Харківська область',
  country: 'Україна',
  serviceArea: 'вся Україна',
  delivery: ['Нова пошта', 'Укрпошта'] as string[],
  orderCutoff: '13:30',
  hours: 'замовлення онлайн 24/7',
}

/** Social + contact channels (source of truth: client screenshots). */
export const SOCIAL = {
  instagram: 'https://www.instagram.com/sumki_kharkov/',
  instagramHandle: '@sumki_kharkov',
  facebook: 'https://www.facebook.com/',
  facebookName: 'Julia Lebedeva',
  telegram: 'https://t.me/',
}

/** Wholesale / dropshipping manager contact. */
export const WHOLESALE = {
  phone: '+380985218707',
  phoneDisplay: '+380 98 521 87 07',
  viber: 'viber://chat?number=%2B380985218707',
  telegram: 'https://t.me/',
}

/** Storefront navigation: the default catalog categories in display order. */
export const NAV_CATEGORIES: { slug: string; name: string; icon: string }[] = [
  { slug: 'phone-bags', name: 'Для телефону', icon: '📱' },
  { slug: 'suede-bags', name: 'Замшеві', icon: '👜' },
  { slug: 'leather-bags', name: 'Шкіряні', icon: '💼' },
  { slug: 'crossbody-bags', name: 'Через плече', icon: '👛' },
  { slug: 'shoppers', name: 'Шопери', icon: '🛍️' },
  { slug: 'backpacks', name: 'Рюкзаки', icon: '🎒' },
  { slug: 'accessories', name: 'Аксесуари', icon: '✨' },
]

/** Per-slug SEO copy for the 7 default category pages. */
export const CATEGORY_META: Record<string, { title: string; h1: string; intro: string }> = {
  'phone-bags': {
    title: 'Сумочки для телефону — JL Bags',
    h1: 'Сумочки для телефону',
    intro:
      'Стильні міні-сумочки для телефону від JL Bags. Замшеві та шкіряні моделі, великий вибір кольорів. Доставка Новою Поштою та Укрпоштою по всій Україні.',
  },
  'suede-bags': {
    title: 'Замшеві сумки — JL Bags',
    h1: 'Замшеві сумки',
    intro:
      'Жіночі замшеві сумки від JL Bags. М\'який матеріал, яскраві кольори, зручна форма. Доставка по всій Україні.',
  },
  'leather-bags': {
    title: 'Шкіряні сумки — JL Bags',
    h1: 'Шкіряні сумки',
    intro:
      'Жіночі шкіряні та еко-шкіряні сумки від JL Bags. Класичні та сучасні моделі. Доставка Новою Поштою по Україні.',
  },
  'crossbody-bags': {
    title: 'Сумки через плече та клатчі — JL Bags',
    h1: 'Сумки через плече',
    intro:
      'Жіночі сумки через плече, клатчі та кросбоді від JL Bags. Компактні та зручні моделі. Доставка по всій Україні.',
  },
  shoppers: {
    title: 'Жіночі шопери — JL Bags',
    h1: 'Жіночі шопери',
    intro:
      'Містки жіночі шопери від JL Bags. Ідеально підходять для щоденного використання та шопінгу. Доставка Новою Поштою.',
  },
  backpacks: {
    title: 'Жіночі рюкзаки — JL Bags',
    h1: 'Жіночі рюкзаки',
    intro:
      'Стильні жіночі рюкзаки від JL Bags. Замшеві та шкіряні моделі, зручні відділення. Доставка по всій Україні.',
  },
  accessories: {
    title: 'Аксесуари — JL Bags',
    h1: 'Аксесуари',
    intro:
      'Жіночі аксесуари від JL Bags: гаманці, ключниці та інше. Доставка Новою Поштою та Укрпоштою по Україні.',
  },
}
