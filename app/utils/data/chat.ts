import type { ChatMessage, ChatThread, Request, Stage } from '../types'
import { REQUESTS } from './requests'

/* Переписка ведётся по заявке — отдельного «общего чата» нет,
   иначе менеджер и клиент теряют контекст. Ветки берутся из тех же
   заявок, что и в таблицах, поэтому номера всегда кликабельны. */

/** Ветка по КП-2025-015 — та самая, что развёрнута на главной. */
const SEW_THREAD: ChatMessage[] = [
  { from: 'client', text: 'Оплату по предоплате отправили сегодня утром.', ago: 2880 },
  { from: 'manager', text: 'Спасибо, предоплату вижу. Размещаю заказ у поставщика.', ago: 1440 },
  {
    from: 'manager',
    text: 'Поставщик подтвердил заказ. Часть позиций отгрузим раньше срока — как соберём партию.',
    ago: 1380,
  },
  { from: 'client', text: 'Отлично. По второй позиции бренд остаётся SEW Eurodrive?', ago: 1380 },
  { from: 'manager', text: 'Да, SEW Eurodrive, как в согласованном КП. Замен не было.', ago: 1320 },
  { from: 'client', text: 'Подскажите, когда отгрузите остаток по этой заявке?', ago: 300 },
  {
    from: 'manager',
    text: 'Уточняю у склада, вернусь в течение часа. Часть позиций уже в пути.',
    ago: 240,
  },
  {
    from: 'manager',
    text: 'Остаток отгрузим завтра, ГТД пришлю в чат. УПД будут готовы после отгрузки — появятся в разделе «Документы».',
    ago: 40,
  },
  {
    from: 'manager',
    text: 'Также обновила КП по новой позиции — можно посмотреть в разделе «КП».',
    ago: 25,
  },
]

/** Короткие ветки по этапам — чтобы каждый чат был осмысленным, а не копией. */
const TEMPLATES: Record<Stage, (r: Request) => ChatMessage[]> = {
  processing: (r) => [
    { from: 'client', text: `Нужен ${r.item}, ${r.qty} шт. Посчитайте, пожалуйста.`, ago: 600 },
    { from: 'manager', text: 'Принял в работу, запрашиваю цены у поставщика.', ago: 420 },
  ],
  clarify: (r) => [
    { from: 'manager', text: `Уточните исполнение по позиции «${r.item}» — есть два.`, ago: 720 },
    { from: 'manager', text: 'Как ответите — сразу посчитаю и пришлю КП.', ago: 715 },
  ],
  kp: (r) => [
    { from: 'manager', text: `Отправила ${r.kpNo}. Срок поставки — ${r.leadTime}.`, ago: 1500 },
    { from: 'client', text: 'Спасибо, смотрим. Вернусь с решением.', ago: 900 },
    { from: 'manager', text: 'Хорошо. Цена держится до конца месяца.', ago: 880 },
  ],
  payment: (r) => [
    { from: 'manager', text: `Счёт ${r.invoiceNo} выставлен, во вложении.`, ago: 2000 },
    { from: 'client', text: 'Передал в бухгалтерию.', ago: 1200 },
  ],
  paid: () => [
    { from: 'manager', text: 'Оплату вижу, размещаю заказ у поставщика.', ago: 1100 },
    { from: 'manager', text: 'Подтверждение от завода пришлю, как получу.', ago: 1080 },
  ],
  transit: (r) => [
    { from: 'manager', text: 'Груз выехал, номер ГТД пришлю отдельно.', ago: 900 },
    { from: 'client', text: 'Когда планируется прибытие?', ago: 400 },
    { from: 'manager', text: `Плановая дата — ${r.planAt}. Отклонений нет.`, ago: 380 },
  ],
  shipped: () => [
    { from: 'manager', text: 'Отгрузили, УПД в разделе «Документы».', ago: 2600 },
    { from: 'client', text: 'Принято, спасибо.', ago: 2500 },
  ],
  canceled: () => [
    { from: 'client', text: 'Потребность закрыли своими силами, заявку отменяем.', ago: 5000 },
    { from: 'manager', text: 'Понял, закрыла заявку. Будем на связи.', ago: 4900 },
  ],
}

/* Непрочитанным чат считается, только когда последнее слово за клиентом:
   менеджер написал и ждёт ответа. Иначе бейджи висят на всех ветках сразу
   и перестают что-либо значить. */
const NEEDS_ANSWER: Stage[] = ['clarify', 'kp', 'payment']

function build(): ChatThread[] {
  const pool = [...REQUESTS].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 12)

  return pool
    .map((r) => ({
      requestId: r.id,
      subject: `${r.brand} • ${r.item}`,
      unread: r.unread && NEEDS_ANSWER.includes(r.stage) ? (r.stage === 'kp' ? 2 : 1) : 0,
      manager: r.manager,
      messages: r.detail ? SEW_THREAD : TEMPLATES[r.stage](r),
    }))
    .sort((a, b) => b.unread - a.unread)
}

export const THREADS: ChatThread[] = build()
