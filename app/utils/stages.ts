import type { Stage, StageMeta, Tone } from './types'

/* Порядок объявления = порядок воронки и порядок чипов в фильтрах. */
export const STAGES: StageMeta[] = [
  {
    key: 'processing',
    label: 'В обработке',
    short: 'Обработка',
    tone: 'neutral',
    next: 'Готовим предложение',
    needsClient: false,
  },
  {
    key: 'clarify',
    label: 'Нужно уточнение',
    short: 'Уточнение',
    tone: 'warn',
    next: 'Ждём ответ от вас',
    needsClient: true,
  },
  {
    key: 'kp',
    label: 'КП отправлено',
    short: 'КП',
    tone: 'info',
    next: 'Ждём решение по КП',
    needsClient: true,
  },
  {
    key: 'payment',
    label: 'Счёт к оплате',
    short: 'К оплате',
    tone: 'warn',
    next: 'Ждём оплату',
    needsClient: true,
  },
  {
    key: 'paid',
    label: 'Оплачено',
    short: 'Оплачено',
    tone: 'ok',
    next: 'Размещаем заказ у поставщика',
    needsClient: false,
  },
  {
    key: 'transit',
    label: 'В пути',
    short: 'В пути',
    tone: 'way',
    next: 'Едет на ваш адрес',
    needsClient: false,
  },
  {
    key: 'shipped',
    label: 'Отгружено',
    short: 'Отгружено',
    tone: 'ok',
    next: 'Закрывающие документы готовы',
    needsClient: false,
  },
  {
    key: 'canceled',
    label: 'Отменена',
    short: 'Отмена',
    tone: 'bad',
    next: 'Заявка закрыта',
    needsClient: false,
  },
]

const BY_KEY = new Map(STAGES.map((s) => [s.key, s]))

export const stage = (key: Stage): StageMeta => BY_KEY.get(key)!

/** CSS-переменная тона — её подставляет класс .tone */
export const TONE_VAR: Record<Tone, string> = {
  neutral: 'var(--c-ink-2)',
  info: 'var(--c-info)',
  warn: 'var(--c-warn)',
  way: 'var(--c-way)',
  ok: 'var(--c-ok)',
  bad: 'var(--c-bad)',
}

/** Этапы, на которых у заявки уже есть КП */
export const WITH_KP: Stage[] = ['kp', 'payment', 'paid', 'transit', 'shipped', 'canceled']

/** Этапы, попадающие в раздел «Заказы» — счёт выставлен, деньги в игре */
export const ORDER_STAGES: Stage[] = ['payment', 'paid', 'transit', 'shipped']

/** Этапы раздела «КП» — предложение готовится, отправлено или уже неактуально */
export const KP_STAGES: Stage[] = ['processing', 'clarify', 'kp', 'canceled']
