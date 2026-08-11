<script setup lang="ts">
  import { addDays, date, money, num } from '~/utils/format'
  import { byId } from '~/utils/data/requests'

  const route = useRoute()
  const { toast } = useToast()

  const req = computed(() => byId(String(route.params.id)))

  const qty = computed(
    () => req.value?.detail?.lines.reduce((s, l) => s + l.qty, 0) ?? req.value?.qty ?? 0,
  )

  /* КП действует 45 дней с даты отправки — дальше цену подтверждает поставщик. */
  const validTill = computed(() =>
    req.value?.kpAt ? date(addDays(new Date(req.value.kpAt), 45)) : '—',
  )

  const meta = computed(() => {
    const r = req.value
    if (!r) return []
    return [
      { label: 'Заявка', value: r.id, to: `/requests/${r.id}` },
      { label: 'Бренд', value: r.brand },
      { label: 'Позиций', value: String(r.detail?.lines.length ?? 1) },
      { label: 'Количество', value: `${num(qty.value)} шт` },
      { label: 'Срок поставки', value: r.leadTime ?? '—' },
      { label: 'Действует до', value: validTill.value },
    ]
  })
</script>

<template>
  <div v-if="req">
    <UiPageHead
      :title="req.kpNo ?? 'Коммерческое предложение'"
      :subtitle="req.item"
      :crumbs="[{ label: 'Главная', to: '/' }, { label: 'КП', to: '/kp' }, { label: req.kpNo! }]"
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <UiStatus :stage="req.stage" />
          <UiPdf :name="`${req.kpNo}.pdf`" />
        </div>
      </template>
    </UiPageHead>

    <section class="rise rise-2 panel mb-4 flex flex-wrap gap-x-10 gap-y-4 p-5">
      <div v-for="m in meta" :key="m.label" class="min-w-0">
        <div class="text-xs font-medium tracking-[0.025em] text-ink-3">
          {{ m.label }}
        </div>
        <NuxtLink
          v-if="m.to"
          :to="m.to"
          class="mt-1 block font-medium text-brand-ink hover:underline"
        >
          {{ m.value }}
        </NuxtLink>
        <div v-else class="mt-1 font-medium">{{ m.value }}</div>
      </div>

      <div class="ml-auto min-w-0">
        <div class="text-xs font-medium tracking-[0.025em] text-ink-3">Итого</div>
        <div class="mt-1 font-display text-xl leading-none tracking-heading">
          {{ money(req.sum) }}
        </div>
      </div>
    </section>

    <div class="rise rise-3">
      <KpLines v-if="req.detail" :detail="req.detail" />
      <div v-else class="panel p-6 text-ink-2">
        Детализация по этому КП придёт файлом — менеджер приложит её в чат по заявке.
      </div>
    </div>

    <!-- решение по КП — то, ради чего клиент сюда зашёл -->
    <div class="rise rise-4 mt-4 flex flex-wrap items-center gap-2.5">
      <button
        class="btn-primary"
        @click="toast('Согласование отправлено менеджеру — счёт придёт в этот же раздел')"
      >
        Согласовать КП
      </button>
      <NuxtLink to="/chat" class="btn-ghost">Задать вопрос менеджеру</NuxtLink>
      <button class="btn-quiet" @click="toast('Запрос на пересчёт отправлен')">
        Запросить пересчёт
      </button>
    </div>
  </div>

  <div v-else class="panel">
    <UiEmpty title="КП не найдено">
      Возможно, ссылка устарела. Откройте список
      <NuxtLink to="/kp" class="text-brand-ink">КП</NuxtLink>.
    </UiEmpty>
  </div>
</template>
