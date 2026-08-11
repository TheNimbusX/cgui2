/** «Сегодня» в демо-данных: кабинет показывает состояние на эту дату. */
export const TODAY = new Date(2026, 6, 1)

const NBSP = ' '

/** 1534884.9 → «1 534 884,90 ₽» (копейки только если они есть) */
export const money = (v: number | null, currency = '₽'): string => {
  if (v === null) return '—'
  const fixed = Math.round(v * 100) / 100
  const frac = fixed % 1 === 0 ? 0 : 2
  return (
    fixed.toLocaleString('ru-RU', { minimumFractionDigits: frac, maximumFractionDigits: 2 }) +
    NBSP +
    currency
  )
}

export const eur = (v: number): string => money(v, '€')

/** 1200000 → «1,2 млн ₽» — для крупных плиток, где важен порядок, а не копейки */
export const moneyShort = (v: number): string => {
  if (v >= 1_000_000) {
    const mln = v / 1_000_000
    return `${num(mln, v % 1_000_000 === 0 ? 0 : 1)}${NBSP}млн ₽`
  }
  if (v >= 1000) return `${num(Math.round(v / 1000))}${NBSP}тыс ₽`
  return money(v)
}

/** Число по-русски: пробел между разрядами, запятая в дробной части */
export const num = (v: number, digits = 0): string =>
  v.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits })

const pad = (n: number) => String(n).padStart(2, '0')

/** Date | ISO → «12.06.2026» */
export const date = (v: string | Date | null): string => {
  if (!v) return '—'
  const d = typeof v === 'string' ? new Date(v) : v
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

export const iso = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const addDays = (d: Date, days: number): Date =>
  new Date(d.getTime() + days * 24 * 60 * 60 * 1000)

export const daysBetween = (from: string | Date, to: string | Date = TODAY): number => {
  const a = typeof from === 'string' ? new Date(from) : from
  const b = typeof to === 'string' ? new Date(to) : to
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/** plural(5, 'день', 'дня', 'дней') → 'дней' */
export const plural = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

export const days = (n: number): string => `${n} ${plural(n, 'день', 'дня', 'дней')}`

/** «3 дня назад» / «сегодня» — от даты обновления к TODAY */
export const ago = (v: string | Date): string => {
  const n = daysBetween(v)
  if (n <= 0) return 'сегодня'
  if (n === 1) return 'вчера'
  return `${days(n)} назад`
}

/** Время сообщения в чате: минуты → «25 мин назад» / «4 ч назад» / «2 дн назад» */
export const agoShort = (minutes: number): string => {
  if (minutes < 60) return `${minutes} мин назад`
  const h = Math.round(minutes / 60)
  if (h < 24) return `${h} ч назад`
  return `${Math.round(h / 24)} дн назад`
}

export const pct = (part: number, total: number): number =>
  total > 0 ? Math.round((part / total) * 100) : 0
