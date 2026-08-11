<script setup lang="ts">
  import { PROFILE } from '~/utils/data/catalog'
  import { TODAY, date, money, plural } from '~/utils/format'
  import { stage } from '~/utils/stages'

  const { requests, chips, totals } = usePortal()
  const chip = useStageFilter()

  const all = computed(() => requests.value)
  const stageChips = computed(() => chips(all.value))

  /* Порядок в списке = порядок работы: сначала то, что не читали,
     потом то, где ход за клиентом, потом всё остальное по свежести. */
  const rows = computed(() => {
    const filtered = all.value.filter((r) => chip.value === 'all' || r.stage === chip.value)
    return [...filtered].sort(
      (a, b) =>
        Number(b.unread) - Number(a.unread) ||
        Number(stage(b.stage).needsClient) - Number(stage(a.stage).needsClient) ||
        b.updatedAt.localeCompare(a.updatedAt),
    )
  })

  const activeLabel = computed(() =>
    chip.value === 'all'
      ? 'Все заявки'
      : (stageChips.value.find((c) => c.key === chip.value)?.label ?? 'Заявки'),
  )

  const cash = computed(() => [
    { label: 'Выставлено', value: money(totals.value.billed) },
    { label: 'Оплачено', value: money(totals.value.paid), tone: 'var(--c-ok)' },
    {
      label: 'К оплате',
      value: money(totals.value.due),
      tone: totals.value.due ? 'var(--c-warn)' : undefined,
    },
    { label: 'Едет к вам', value: money(totals.value.transit), tone: 'var(--c-way)' },
    { label: 'Отгружено', value: money(totals.value.shipped) },
  ])
</script>

<template>
  <div>
    <UiPageHead
      title="Кабинет клиента"
      :subtitle="`${PROFILE.company} · договор ${PROFILE.contract} · данные на ${date(TODAY)}`"
    />

    <section class="mb-8" aria-label="Требует внимания">
      <h2 class="rise rise-1 mb-3 text-xs font-medium tracking-[0.025em] text-ink-3">
        ТРЕБУЕТ ВНИМАНИЯ
      </h2>
      <AttentionGrid />
    </section>

    <div class="rise rise-3 mb-8 grid grid-cols-3 gap-4 max-xl:grid-cols-1">
      <div class="col-span-2 max-xl:col-span-1">
        <StageFunnel v-model="chip" :items="stageChips" />
      </div>

      <section class="panel overflow-hidden" aria-label="Деньги по договору">
        <header class="border-b border-line px-5 py-3.5">
          <h2 class="font-display text-base tracking-heading">Деньги по договору</h2>
        </header>
        <dl class="px-5 py-1">
          <div
            v-for="m in cash"
            :key="m.label"
            class="flex items-baseline justify-between gap-4 border-b border-line-soft py-3 last:border-b-0"
          >
            <dt class="text-sm text-ink-2">{{ m.label }}</dt>
            <dd
              class="text-sm font-medium tabular-nums"
              :style="m.tone ? { color: `rgb(${m.tone})` } : undefined"
            >
              {{ m.value }}
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <section aria-label="Заявки">
      <div class="rise rise-4 mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 class="font-display text-base tracking-heading">{{ activeLabel }}</h2>
        <p class="text-xs text-ink-3">
          {{ rows.length }} {{ plural(rows.length, 'заявка', 'заявки', 'заявок') }} · строка
          раскрывается по клику
        </p>
        <button
          v-if="chip !== 'all'"
          class="ml-auto text-xs font-medium text-brand-deep hover:underline"
          @click="chip = 'all'"
        >
          Показать все
        </button>
      </div>

      <div class="rise rise-5">
        <RequestsTable :rows="rows" />
      </div>
    </section>
  </div>
</template>
