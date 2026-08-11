import type { Doc, DocKind, Request } from '../types'
import { PROFILE } from './catalog'
import { REQUESTS } from './requests'

/* ============================================================
   Документы не заводятся отдельным списком — они выпускаются
   по ходу заявки. Правило простое и проверяемое глазами:

   КП            — заявка дошла до предложения (или отменена после него)
   Счёт          — счёт выставлен
   Спецификация  — заказ размещён у поставщика
   УПД           — груз отгружен клиенту
   Договор       — один рамочный на всю компанию
   ============================================================ */

export const DOC_KINDS: { key: DocKind; label: string; plural: string }[] = [
  { key: 'contract', label: 'Договор', plural: 'Договор' },
  { key: 'spec', label: 'Спецификация', plural: 'Спецификации' },
  { key: 'upd', label: 'УПД', plural: 'УПД' },
  { key: 'invoice', label: 'Счёт', plural: 'Счета' },
  { key: 'kp', label: 'КП', plural: 'КП' },
]

const from = (r: Request, kind: DocKind, name: string, date: string): Doc => ({
  id: `${kind}-${r.id}`,
  name,
  kind,
  date,
  requestId: r.id,
  item: r.item,
  brand: r.brand,
  qty: r.qty,
  sum: r.sum ?? 0,
})

function build(): Doc[] {
  const out: Doc[] = [
    {
      id: 'contract',
      name: `Договор поставки №${PROFILE.contract}`,
      kind: 'contract',
      date: PROFILE.contractAt,
      requestId: null,
      item: 'Рамочный договор — комплексные поставки',
      brand: '—',
      qty: 1,
      sum: 0,
    },
  ]

  for (const r of REQUESTS) {
    if (r.kpNo && (r.stage === 'kp' || r.stage === 'canceled')) {
      out.push(from(r, 'kp', r.kpNo, r.kpAt ?? r.createdAt))
    }
    if (r.invoiceNo && r.invoiceAt) {
      out.push(from(r, 'invoice', `Счёт №${r.invoiceNo}`, r.invoiceAt))
    }
    if (r.orderedAt) {
      out.push(from(r, 'spec', `Спецификация №С-${r.id.slice(-3)}`, r.orderedAt))
    }
    if (r.hasUpd && r.planAt) {
      out.push(from(r, 'upd', `УПД №${1000 + Number(r.id.slice(-3))}`, r.planAt))
    }
  }

  return out.sort((a, b) => b.date.localeCompare(a.date))
}

export const DOCS: Doc[] = build()
