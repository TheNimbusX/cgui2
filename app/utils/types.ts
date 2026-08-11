/* ============================================================
   Модель данных кабинета.

   Ключевая идея: у портала один список — заявки. Всё остальное
   (КП, заказы, документы, чаты) это проекции того же списка на
   разные этапы жизненного цикла. Поэтому суммы и счётчики в
   разделах не могут разойтись между собой.
   ============================================================ */

/** Этап заявки. Порядок в объекте = порядок в воронке. */
export type Stage =
  | 'processing' // приняли, разбираем потребность
  | 'clarify' // нужен ответ клиента
  | 'kp' // КП отправлено, ждём решение
  | 'payment' // счёт выставлен, ждём оплату
  | 'paid' // оплачено, размещаем у поставщика
  | 'transit' // едет
  | 'shipped' // отгружено клиенту
  | 'canceled'

/** Смысловой тон. Их шесть — больше интерфейсу не нужно. */
export type Tone = 'neutral' | 'info' | 'warn' | 'way' | 'ok' | 'bad'

export interface StageMeta {
  key: Stage
  label: string
  /** Короткая подпись для узких мест (мобильные карточки) */
  short: string
  tone: Tone
  /** Что происходит дальше — показываем под статусом и в карточках внимания */
  next: string
  /** Действие на стороне клиента: такие заявки поднимаются наверх */
  needsClient: boolean
}

/** Позиция в составе КП */
export interface KpLine {
  name: string
  sku: string
  qty: number
  /** цена за штуку, € */
  price: number
}

/** Развёрнутый состав КП (есть не у каждой заявки — только там, где прислали спецификацию) */
export interface KpDetail {
  currency: 'EUR'
  rate: number
  /** итог в валюте КП */
  total: number
  /** итог в рублях, как в счёте */
  totalRub: number
  leadTime: string
  lines: KpLine[]
}

export interface Manager {
  name: string
  role: string
  phone: string
  email: string
}

export interface Request {
  id: string
  /** номер КП, если оно сформировано */
  kpNo: string | null
  stage: Stage
  unread: boolean

  item: string
  brand: string
  qty: number
  /** сумма КП/счёта в рублях; null — пока не посчитана */
  sum: number | null
  leadTime: string | null

  createdAt: string
  kpAt: string | null
  updatedAt: string

  /** выставлено / оплачено, ₽ */
  billed: number
  paid: number
  invoiceNo: string | null
  invoiceAt: string | null

  /** заказ у поставщика */
  orderedAt: string | null
  /** плановая дата поставки */
  planAt: string | null
  /** УПД выдан */
  hasUpd: boolean

  manager: Manager
  detail: KpDetail | null
}

export type DocKind = 'contract' | 'spec' | 'upd' | 'invoice' | 'kp'

export interface Doc {
  id: string
  name: string
  kind: DocKind
  date: string
  /** заявка, к которой относится документ */
  requestId: string | null
  item: string
  brand: string
  qty: number
  sum: number
}

export interface ChatMessage {
  from: 'client' | 'manager'
  text: string
  /** минут назад от «сейчас» */
  ago: number
}

export interface ChatThread {
  requestId: string
  subject: string
  unread: number
  manager: Manager
  messages: ChatMessage[]
}
