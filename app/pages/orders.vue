<script setup lang="ts">
  import { money } from '~/utils/format'

  const { scoped, chips, overdue } = usePortal()
  const chip = useStageFilter()

  const all = scoped('orders')
  const stageChips = computed(() => chips(all.value))

  /* Порядок разделов: сначала то, что ждёт денег, потом то, что едет
     (ближайшая поставка выше), и только затем закрытые отгрузки. */
  const PRIORITY: Record<string, number> = { payment: 0, transit: 1, paid: 2, shipped: 3 }

  const rows = computed(() => {
    const filtered = all.value.filter((r) => chip.value === 'all' || r.stage === chip.value)
    return [...filtered].sort((a, b) => {
      const byStage = PRIORITY[a.stage]! - PRIORITY[b.stage]!
      if (byStage) return byStage
      // отгруженные — свежие сверху, остальные — по приближению срока
      return a.stage === 'shipped'
        ? (b.planAt ?? '').localeCompare(a.planAt ?? '')
        : (a.planAt ?? '9999').localeCompare(b.planAt ?? '9999')
    })
  })

  const due = computed(() => all.value.reduce((s, r) => s + (r.billed - r.paid), 0))
  const subtitle = computed(() => {
    const parts = [`к оплате ${money(due.value)}`]
    if (overdue.value.length) parts.push(`${overdue.value.length} с отклонением по сроку`)
    return parts.join(' · ')
  })
</script>

<template>
  <div>
    <UiPageHead
      title="Заказы"
      :subtitle="subtitle"
      :crumbs="[{ label: 'Главная', to: '/' }, { label: 'Заказы' }]"
    />

    <div class="rise rise-2 mb-3">
      <UiChips v-model="chip" :items="stageChips" label="Фильтр по этапу" />
    </div>

    <div class="rise rise-3">
      <OrdersTable :rows="rows" />
    </div>
  </div>
</template>
