import type { Request, Stage } from '~/utils/types'
import { REQUESTS } from '~/utils/data/requests'
import { THREADS } from '~/utils/data/chat'
import { DOCS } from '~/utils/data/docs'
import { KP_STAGES, ORDER_STAGES, STAGES } from '~/utils/stages'
import { TODAY, daysBetween } from '~/utils/format'

export interface StageChip {
  key: Stage | 'all'
  label: string
  count: number
  unread: number
  /** сумма заявок этапа, ₽ — нужна воронке на главной */
  sum: number
  tone: string
}

/** Поисковая строка в шапке фильтрует любой открытый список. */
const matches = (r: Request, q: string) =>
  !q ||
  `${r.id} ${r.kpNo ?? ''} ${r.invoiceNo ?? ''} ${r.item} ${r.brand}`.toLowerCase().includes(q)

export const usePortal = () => {
  const search = useState('search', () => '')
  const query = computed(() => search.value.trim().toLowerCase())

  const requests = computed(() => REQUESTS.filter((r) => matches(r, query.value)))

  /** Заявки раздела: главная — все, КП и заказы — свои этапы. */
  const scoped = (scope: 'all' | 'kp' | 'orders') =>
    computed(() => {
      const keys = scope === 'kp' ? KP_STAGES : scope === 'orders' ? ORDER_STAGES : null
      return requests.value.filter((r) => !keys || keys.includes(r.stage))
    })

  /** Срез по этапам: количество, непрочитанные и сумма — от текущей выборки. */
  const sumOf = (rows: Request[]) => rows.reduce((s, r) => s + (r.sum ?? 0), 0)

  const chips = (rows: Request[]): StageChip[] => {
    const present = STAGES.filter((s) => rows.some((r) => r.stage === s.key))
    return [
      {
        key: 'all' as const,
        label: 'Все',
        count: rows.length,
        unread: rows.filter((r) => r.unread).length,
        sum: sumOf(rows),
        tone: 'neutral',
      },
      ...present.map((s) => {
        const grp = rows.filter((r) => r.stage === s.key)
        return {
          key: s.key,
          label: s.label,
          count: grp.length,
          unread: grp.filter((r) => r.unread).length,
          sum: sumOf(grp),
          tone: s.tone,
        }
      }),
    ]
  }

  const unreadRequests = computed(() => REQUESTS.filter((r) => r.unread).length)
  const unreadChats = computed(() => THREADS.reduce((s, t) => s + t.unread, 0))

  const overdue = computed(() =>
    REQUESTS.filter((r) => r.stage === 'transit' && r.planAt && new Date(r.planAt) < TODAY),
  )

  /** Блок «Требует внимания»: только то, где ход за клиентом. */
  const attention = computed(() => {
    const byStage = (k: Stage) => REQUESTS.filter((r) => r.stage === k)
    const kp = byStage('kp')
    const pay = byStage('payment')
    const clarify = byStage('clarify')

    return [
      {
        key: 'kp',
        to: '/kp',
        label: 'КП ждут решения',
        count: kp.length,
        sum: kp.reduce((s, r) => s + (r.sum ?? 0), 0),
        note: 'Согласуйте или задайте вопрос менеджеру',
        tone: 'info',
      },
      {
        key: 'payment',
        to: '/orders',
        label: 'Счета к оплате',
        count: pay.length,
        sum: pay.reduce((s, r) => s + (r.billed - r.paid), 0),
        note: 'Оплата запускает размещение заказа',
        tone: 'warn',
      },
      {
        key: 'clarify',
        to: '/?stage=clarify',
        label: 'Нужно уточнение',
        count: clarify.length,
        sum: null,
        note: 'Без ответа расчёт стоит на месте',
        tone: 'warn',
      },
      {
        key: 'overdue',
        to: '/orders?stage=transit',
        label: 'Отклонение по сроку',
        count: overdue.value.length,
        sum: null,
        note: overdue.value.length
          ? `Просрочка ${Math.abs(daysBetween(overdue.value[0]!.planAt!))} дн — менеджер уточняет`
          : 'Все поставки идут по плану',
        tone: overdue.value.length ? 'bad' : 'ok',
      },
    ]
  })

  /** Сводка по деньгам — нижняя строка дашборда. */
  const totals = computed(() => {
    const billed = REQUESTS.reduce((s, r) => s + r.billed, 0)
    const paid = REQUESTS.reduce((s, r) => s + r.paid, 0)
    const transit = REQUESTS.filter((r) => r.stage === 'transit').reduce((s, r) => s + r.paid, 0)
    const shipped = REQUESTS.filter((r) => r.stage === 'shipped').reduce((s, r) => s + r.paid, 0)
    return { billed, paid, due: billed - paid, transit, shipped }
  })

  return {
    search,
    requests,
    scoped,
    chips,
    unreadRequests,
    unreadChats,
    overdue,
    attention,
    totals,
    docsCount: DOCS.length,
  }
}
