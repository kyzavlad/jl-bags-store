export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jl-bags-store.vercel.app'
).replace(/\/$/, '')

export const BRAND = {
  name: 'JL Bags',
  phone: '+380964249565',
  phoneDisplay: '+38 096 424 95 65',
  city: 'Харків',
  region: 'Харківська область',
  country: 'Україна',
  serviceArea: 'вся Україна',
  delivery: ['Нова пошта', 'Укрпошта'] as string[],
  orderCutoff: '13:30',
  hours: 'замовлення онлайн 24/7',
}

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
