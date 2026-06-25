'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

const FAQ = [
  {
    q: 'Як швидко відправляються замовлення?',
    a: 'Замовлення, оформлені до 13:30, ми відправляємо того ж робочого дня. Решта — наступного робочого дня. Зазвичай відправка займає 1–2 робочих дні.',
  },
  {
    q: 'Які способи доставки доступні?',
    a: 'Доставляємо Новою Поштою та Укрпоштою по всій Україні — у відділення, поштомат або кур\'єром на адресу. Оплата при отриманні (накладений платіж) або передоплата.',
  },
  {
    q: 'Скільки зберігаються посилки на пошті?',
    a: 'Нова Пошта зберігає посилку безкоштовно протягом 5 днів, далі діє платне зберігання. Укрпошта — до 5 днів. Радимо забирати замовлення вчасно.',
  },
  {
    q: 'Які умови для оптових закупівель?',
    a: 'Для оптовиків і дропшиперів діють спеціальні ціни та умови. Залиште заявку або зв\'яжіться з менеджером — підберемо асортимент і розкажемо про співпрацю.',
  },
]

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto divide-y divide-neutral-200 border-y border-neutral-200">
      {FAQ.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-5">
                <span className={`text-sm font-semibold tabular-nums shrink-0 ${isOpen ? 'text-black' : 'text-neutral-400'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`text-base sm:text-lg font-semibold transition-colors ${isOpen ? 'text-black' : 'text-neutral-800'}`}>
                  {item.q}
                </span>
              </div>
              <span className="w-8 h-8 shrink-0 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600">
                {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden pl-11">
                <p className="pb-6 text-sm text-neutral-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
