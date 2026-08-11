<script setup lang="ts">
  import { money } from '~/utils/format'

  const { scoped, chips } = usePortal()
  const chip = useStageFilter()

  const all = scoped('kp')
  const stageChips = computed(() => chips(all.value))

  const rows = computed(() => {
    const filtered = all.value.filter((r) => chip.value === 'all' || r.stage === chip.value)
    // сначала отправленные КП — по ним ждут решение
    return [...filtered].sort(
      (a, b) =>
        Number(b.stage === 'kp') - Number(a.stage === 'kp') ||
        Number(b.unread) - Number(a.unread) ||
        (b.kpAt ?? '').localeCompare(a.kpAt ?? ''),
    )
  })

  const waiting = computed(() => all.value.filter((r) => r.stage === 'kp'))
  const waitingSum = computed(() => waiting.value.reduce((s, r) => s + (r.sum ?? 0), 0))
</script>

<template>
  <div>
    <UiPageHead
      title="Коммерческие предложения"
      :subtitle="`${waiting.length} КП ждут вашего решения на ${money(waitingSum)}`"
      :crumbs="[{ label: 'Главная', to: '/' }, { label: 'КП' }]"
    />

    <div class="rise rise-2 mb-3">
      <UiChips v-model="chip" :items="stageChips" label="Фильтр по этапу" />
    </div>

    <div class="rise rise-3">
      <RequestsTable :rows="rows" />
    </div>
  </div>
</template>
