# JL Bags Store

Каталог и админ-панель JL Bags на **Next.js (App Router) + TypeScript + Tailwind + Supabase**, деплой на **Vercel**.

## Возможности

- **Публичный прайс-лист** `/pricelist?key=…` — поиск по коду/названию/цвету, фильтр по наличию, мобильная и десктоп-версии.
- **Админ-логин** `/admin` — вход по email/паролю (Supabase Auth) с понятными сообщениями об ошибках.
- **Товары** `/admin/products` — список, поиск, фильтры (в наличии / нет / без фото / без описания / без розн. цены), редактор товара с вариантами и фото.
- **Импорт** `/admin/import` — синхронизация остатков из Google Sheets CSV. **Обновляются только остатки**; цены, фото, описания, материалы, размеры и категории не перезаписываются.
- **Настройки** `/admin/settings` — базовые настройки магазина.

## Стек и архитектура

- Серверные операции с БД идут через **service-role** ключ (`lib/supabase/server.ts`) и проверяют JWT админа (`lib/admin-auth.ts`).
- На таблицах включён RLS без публичных политик — анонимный ключ не имеет прямого доступа.
- Бизнес-логика импорта в `lib/pricelist-import.ts`.

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

| Переменная | Назначение |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon-ключ (для логина в браузере) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role ключ (серверные операции) |
| `GOOGLE_SHEET_CSV_URL` | Ссылка на таблицу/CSV для синхронизации |
| `PRICELIST_KEY` | Ключ доступа к публичному прайсу (`?key=`) |
| `NEXT_PUBLIC_SITE_URL` | Публичный адрес сайта |
| `N8N_WEBHOOK_URL` | (необязательно) вебхук для автоматизаций |

## Настройка с нуля

### 1. Создать проект Supabase
- https://supabase.com → New project. Скопируйте Project URL, anon key и service_role key (Settings → API).

### 2. Применить миграции
- Supabase → SQL Editor → вставьте содержимое `supabase/migrations/001_init.sql` → Run.
- (Либо через Supabase CLI: `supabase db push`.)

### 3. Создать пользователя-админа
- Supabase → Authentication → Users → **Add user** → задайте email и пароль.
- Этот email/пароль используются для входа на `/admin`.

### 4. Задать переменные в Vercel
- Vercel → проект → Settings → Environment Variables → добавьте все переменные из таблицы выше (Production + Preview).

### 5. Деплой
- Подключите репозиторий `kyzavlad/jl-bags-store` к проекту Vercel и задеплойте, либо `vercel --prod`.

### 6. Первая синхронизация
- Опубликуйте Google-таблицу как CSV: Файл → Поделиться → Опубликовать в интернете → выберите лист → CSV.
- Вставьте ссылку в `GOOGLE_SHEET_CSV_URL`.
- Войдите в `/admin` → **Импорт** → «Синхронизировать».

## Формат таблицы для импорта

- Колонка **B** — товар: код + цвет/вариант (например `1234 замша чёрный`).
- Колонка **C** — остаток (число).
- Код берётся как первый токен, остальное — цвет/вариант.

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # заполнить значения
npm run dev                  # http://localhost:3000
```

Проверки перед деплоем:

```bash
npx tsc --noEmit
npm run build
```
