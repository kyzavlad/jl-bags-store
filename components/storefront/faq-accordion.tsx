'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ = [
  {
    q: 'Як швидко відправляються замовлення?',
    a: 'Замовлення, оформлені до 13:30, ми відправляємо того ж робочого дня. Решта — наступного робочого дня. Зазвичай відправка займає 1–2 робочих дні.',
  },
  {
    q: 'Які способи доставки доступні?',
    a: 'Доставляємо Новою Поштою та Укрпоштою по всій Україні — у відділення, поштомат або кур’єром. Оплата при отриманні (накладений платіж) або передоплата.',
  },
  {
    q: 'Скільки зберігаються посилки на пошті?',
    a: 'Нова Пошта зберігає посилку безкоштовно протягом 5 днів, далі діє платне зберігання. Укрпошта — до 5 днів. Радимо забирати замовлення вчасно.',
  },
  {
    q: 'Які умови для оптових закупівель?',
    a: 'Для оптовиків і дропшиперів діють спеціальні ціни та умови. Залиште заявку або зв’яжіться з менеджером — підберемо асортимент і розкажемо про співпрацю.',
  },
]

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="max-w-3xl mx-auto divide-y divide-neutral-200 border-y border-neutral-200">
      {FAQ.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-medium text-neutral-900">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-neutral-500 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-sm text-neutral-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
