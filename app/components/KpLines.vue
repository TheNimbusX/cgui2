<script setup lang="ts">
  import type { KpDetail } from '~/utils/types'
  import { eur, money, num, plural } from '~/utils/format'

  const props = withDefaults(defineProps<{ detail: KpDetail; limit?: number }>(), { limit: 0 })

  const lines = computed(() =>
    props.limit ? props.detail.lines.slice(0, props.limit) : props.detail.lines,
  )
  const hidden = computed(() => props.detail.lines.length - lines.value.length)
  const qty = computed(() => props.detail.lines.reduce((s, l) => s + l.qty, 0))
</script>

<template>
  <div class="overflow-hidden rounded-card border border-line bg-surface">
    <div class="overflow-x-auto">
      <table class="grid-table min-w-[620px] text-sm">
        <thead>
          <tr>
            <th class="w-[44%]">Позиция</th>
            <th>Артикул</th>
            <th class="num">Кол-во</th>
            <th class="num">Цена, €</th>
            <th class="num">Сумма, €</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in lines" :key="l.sku">
            <td class="font-medium leading-snug">{{ l.name }}</td>
            <td class="whitespace-nowrap text-ink-2">{{ l.sku }}</td>
            <td class="num whitespace-nowrap text-ink-2">{{ l.qty }} шт</td>
            <td class="num whitespace-nowrap text-ink-2">{{ eur(l.price) }}</td>
            <td class="num whitespace-nowrap font-medium">{{ eur(l.price * l.qty) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="hidden > 0"
      class="border-t border-line-soft px-4 py-2.5 text-xs text-ink-3"
      role="note"
    >
      и ещё {{ hidden }} {{ plural(hidden, 'позиция', 'позиции', 'позиций') }} в полном КП
    </div>

    <dl
      class="flex flex-wrap gap-x-9 gap-y-3 border-t border-line bg-surface-2/60 px-4 py-3.5 text-sm"
    >
      <div>
        <dt class="text-xs text-ink-3">Позиций</dt>
        <dd class="font-medium">{{ detail.lines.length }} · {{ num(qty) }} шт</dd>
      </div>
      <div>
        <dt class="text-xs text-ink-3">Итого</dt>
        <dd class="font-medium">{{ eur(detail.total) }}</dd>
      </div>
      <div>
        <dt class="text-xs text-ink-3">В рублях · курс {{ num(detail.rate, 2) }}</dt>
        <dd class="font-medium">{{ money(detail.totalRub) }}</dd>
      </div>
      <div>
        <dt class="text-xs text-ink-3">Срок поставки</dt>
        <dd class="font-medium">{{ detail.leadTime }}</dd>
      </div>
    </dl>
  </div>
</template>
