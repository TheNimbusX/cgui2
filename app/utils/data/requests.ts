import type { Request, Stage } from '../types'
import { TODAY, addDays, iso } from '../format'
import { WITH_KP } from '../stages'
import { AMOUNTS, LEAD_TIMES, MANAGER_LIST, PRODUCTS, SEW_KP } from './catalog'

/* ============================================================
   Заявки кабинета — 42 штуки, 12 непрочитанных.
   Раскладка по этапам и «живые» строки взяты из прототипа;
   даты и суммы считаются от TODAY, чтобы «осталось 18 дней» и
   «обновлено вчера» не расходились с датами в соседних колонках.
   ============================================================ */

interface Seed {
  stage: Stage
  count: number
  /** сколько первых строк этапа помечены как непрочитанные */
  unread: number
  /** возраст заявки в днях на позиции k */
  age: (k: number) => number
}

const SEEDS: Seed[] = [
  { stage: 'processing', count: 4, unread: 2, age: (k) => 2 + k * 2 },
  { stage: 'clarify', count: 2, unread: 1, age: (k) => 5 + k * 3 },
  { stage: 'kp', count: 6, unread: 4, age: (k) => 9 + k * 4 },
  { stage: 'payment', count: 3, unread: 1, age: (k) => 18 + k * 5 },
  { stage: 'paid', count: 1, unread: 0, age: () => 26 },
  { stage: 'transit', count: 8, unread: 1, age: (k) => 34 + k * 6 },
  { stage: 'shipped', count: 8, unread: 1, age: (k) => 62 + k * 7 },
  { stage: 'canceled', count: 10, unread: 2, age: (k) => 40 + k * 11 },
]

/** Строки, которые в прототипе заданы руками — их номера и позиции узнаваемы. */
const PINNED: Record<string, Partial<Request>> = {
  'processing:0': {
    item: 'Промышленный ПК BECKHOFF CP2215-1004-000',
    brand: 'Beckhoff',
    qty: 1,
  },
  'processing:1': {
    item: 'Насос Hawe Hydraulik R 2.9, 600 bar',
    brand: 'Hawe Hydraulik',
    qty: 2,
  },
  'kp:0': {
    id: 'ДГ-2025-015',
    kpNo: 'КП-2025-015',
    item: 'Мотор-редукторы SEW Eurodrive — комплект',
    brand: 'SEW Eurodrive',
    qty: 23,
    sum: SEW_KP.totalRub,
    leadTime: SEW_KP.leadTime,
    detail: SEW_KP,
  },
  'kp:1': {
    id: 'ДГ-2025-011',
    kpNo: 'КП-2025-011',
    item: 'Насос гидравлический R 2.9, 600 bar',
    brand: 'Hawe Hydraulik',
    qty: 2,
    sum: 1_240_000,
    leadTime: '8–10 недель',
  },
  'kp:2': {
    id: 'ДГ-2025-010',
    kpNo: 'КП-2025-010',
    item: 'Частотный преобразователь ACS880',
    brand: 'ABB',
    qty: 1,
    sum: 920_000,
    leadTime: '5–7 недель',
  },
  'kp:3': {
    id: 'ДГ-2025-009',
    kpNo: 'КП-2025-009',
    item: 'Сервопривод SINAMICS S120',
    brand: 'Siemens',
    qty: 2,
    sum: 1_780_000,
    leadTime: '7–9 недель',
  },
  'kp:4': {
    id: 'ДГ-2025-008',
    kpNo: 'КП-2025-008',
    item: 'Индуктивный датчик BES M18MI',
    brand: 'Balluff',
    qty: 12,
    sum: 312_000,
    leadTime: '3–5 недель',
  },
  'kp:5': {
    id: 'ДГ-2025-007',
    kpNo: 'КП-2025-007',
    item: 'Гидравлический фильтр 0160D010BN4HC',
    brand: 'Hydac',
    qty: 6,
    sum: 456_000,
    leadTime: '4–6 недель',
  },
  'payment:0': {
    id: 'ДГ-2025-021',
    kpNo: 'КП-2025-021',
    item: 'Промышленный контроллер Siemens S7-1500',
    brand: 'Siemens',
    qty: 1,
    sum: 780_000,
    leadTime: '6–8 недель',
    invoiceNo: 'СЧ-2025-021',
    invoiceAt: '2026-06-25',
  },
  'transit:0': {
    id: 'ДГ-2025-018',
    kpNo: 'КП-2025-018',
    item: 'Частотный преобразователь ABB ACS880',
    brand: 'ABB',
    qty: 2,
    sum: 1_240_000,
    leadTime: '5–7 недель',
    invoiceNo: 'СЧ-2025-018',
    invoiceAt: '2026-06-18',
    orderedAt: '2026-06-21',
    planAt: '2026-08-12',
  },
  'shipped:0': {
    id: 'ДГ-2025-014',
    kpNo: 'КП-2025-014',
    item: 'Датчик индуктивный Balluff BES M18MI',
    brand: 'Balluff',
    qty: 12,
    sum: 312_000,
    leadTime: '3–5 недель',
    invoiceNo: 'СЧ-2025-014',
    invoiceAt: '2026-06-07',
    orderedAt: '2026-06-10',
    planAt: '2026-07-01',
  },
}

function build(): Request[] {
  const out: Request[] = []
  let g = 0

  for (const seed of SEEDS) {
    for (let k = 0; k < seed.count; k++) {
      g++

      const nn = String(100 + g)
      const product = PRODUCTS[g % PRODUCTS.length]!
      const amount = AMOUNTS[g % AMOUNTS.length]!
      const age = seed.age(k)
      const hasKp = WITH_KP.includes(seed.stage)
      const priced = seed.stage !== 'processing' && seed.stage !== 'clarify'
      const closed = seed.stage === 'shipped' || seed.stage === 'canceled'

      const createdAt = iso(addDays(TODAY, -age))
      const kpAt = hasKp ? iso(addDays(TODAY, -age + 2 + (g % 2))) : null

      // деньги: счёт появляется на этапе «к оплате» и живёт дальше
      let billed = 0
      let paid = 0
      if (seed.stage === 'payment') {
        billed = amount
        paid = k === 1 ? amount / 2 : 0 // одна заявка оплачена частично
      } else if (seed.stage === 'paid' || seed.stage === 'transit' || seed.stage === 'shipped') {
        billed = amount
        paid = amount
      }

      const invoiceAt = billed ? iso(addDays(TODAY, -age + 5)) : null
      const orderedAt = paid && seed.stage !== 'payment' ? iso(addDays(TODAY, -age + 8)) : null

      // плановая дата поставки: у «в пути» — впереди, кроме одной просроченной
      let planAt: string | null = null
      if (seed.stage === 'transit') planAt = iso(addDays(TODAY, k === 2 ? -3 : 7 + ((g * 5) % 40)))
      else if (seed.stage === 'paid') planAt = iso(addDays(TODAY, 46))
      else if (seed.stage === 'shipped') planAt = iso(addDays(TODAY, -age + 30))

      const row: Request = {
        id: `ДГ-2025-${nn}`,
        kpNo: hasKp ? `КП-2025-${nn}` : null,
        stage: seed.stage,
        unread: k < seed.unread,

        item: product.item,
        brand: product.brand,
        qty: (g % 5) + 1,
        sum: priced ? amount : null,
        leadTime: priced ? LEAD_TIMES[g % LEAD_TIMES.length]! : null,

        createdAt,
        kpAt,
        updatedAt: iso(addDays(TODAY, -Math.min(age, closed ? 9 + (g % 14) : g % 6))),

        billed,
        paid,
        invoiceNo: billed ? `СЧ-2025-${nn}` : null,
        invoiceAt,

        orderedAt,
        planAt,
        hasUpd: seed.stage === 'shipped',

        manager: MANAGER_LIST[g % MANAGER_LIST.length]!,
        detail: null,
      }

      const pinned = PINNED[`${seed.stage}:${k}`]
      if (pinned) {
        Object.assign(row, pinned)
        // сумма из закреплённой строки должна попасть и в счёт
        if (row.billed) row.billed = row.sum ?? row.billed
        if (row.paid) row.paid = row.sum ?? row.paid
      }

      out.push(row)
    }
  }

  return out
}

export const REQUESTS: Request[] = build()

export const byId = (id: string): Request | undefined => REQUESTS.find((r) => r.id === id)
