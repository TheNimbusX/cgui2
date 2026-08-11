<script setup lang="ts">
  import type { Tone } from '~/utils/types'
  import { DOCS, DOC_KINDS } from '~/utils/data/docs'
  import { plural } from '~/utils/format'

  const { search } = usePortal()

  const TONES: Record<string, Tone> = {
    contract: 'neutral',
    spec: 'info',
    upd: 'ok',
    invoice: 'warn',
    kp: 'info',
  }

  const kind = ref('all')
  const limit = ref(25)

  const found = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return DOCS
    return DOCS.filter((d) =>
      `${d.name} ${d.requestId ?? ''} ${d.item} ${d.brand}`.toLowerCase().includes(q),
    )
  })

  const chips = computed(() => [
    { key: 'all', label: 'Все', count: found.value.length, unread: 0, tone: 'neutral' as Tone },
    ...DOC_KINDS.map((k) => ({
      key: k.key,
      label: k.plural,
      count: found.value.filter((d) => d.kind === k.key).length,
      unread: 0,
      tone: TONES[k.key]!,
    })).filter((c) => c.count > 0),
  ])

  const filtered = computed(() =>
    found.value.filter((d) => kind.value === 'all' || d.kind === kind.value),
  )

  const rows = computed(() => filtered.value.slice(0, limit.value))
  const rest = computed(() => filtered.value.length - rows.value.length)

  // при смене фильтра список снова показывается с начала
  watch([kind, search], () => (limit.value = 25))
</script>

<template>
  <div>
    <UiPageHead
      title="Документы"
      :subtitle="`${filtered.length} ${plural(filtered.length, 'документ', 'документа', 'документов')} по вашим заявкам — КП, счета, спецификации и УПД`"
      :crumbs="[{ label: 'Главная', to: '/' }, { label: 'Документы' }]"
    />

    <div class="rise rise-2 mb-3">
      <UiChips v-model="kind" :items="chips" label="Фильтр по типу документа" />
    </div>

    <div class="rise rise-3">
      <DocsTable :rows="rows" />
    </div>

    <div v-if="rest > 0" class="mt-3 flex justify-center">
      <button class="btn-ghost" @click="limit += 25">
        Показать ещё {{ Math.min(rest, 25) }} из {{ rest }}
      </button>
    </div>
  </div>
</template>
