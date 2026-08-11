<script setup lang="ts">
  import type { Request } from '~/utils/types'
  import { TODAY, date, days, daysBetween } from '~/utils/format'

  /* Срок поставки — то, ради чего снабженец вообще заходит в кабинет.
     Показываем дату и словами: сколько осталось или насколько просрочено. */
  const props = defineProps<{ req: Request }>()

  const left = computed(() => (props.req.planAt ? -daysBetween(props.req.planAt, TODAY) : null))

  const note = computed(() => {
    if (!props.req.planAt) return null
    if (props.req.stage === 'shipped') return { text: 'доставлено', tone: 'var(--c-ok)' }
    if (left.value! < 0) return { text: `просрочено ${days(-left.value!)}`, tone: 'var(--c-bad)' }
    if (left.value! <= 7) return { text: `осталось ${days(left.value!)}`, tone: 'var(--c-warn)' }
    return { text: `осталось ${days(left.value!)}`, tone: null }
  })
</script>

<template>
  <div>
    <div class="whitespace-nowrap">{{ date(req.planAt) }}</div>
    <div
      v-if="note"
      class="mt-0.5 whitespace-nowrap text-xs"
      :class="note.tone ? 'font-medium' : 'text-ink-3'"
      :style="note.tone ? { color: `rgb(${note.tone})` } : undefined"
    >
      {{ note.text }}
    </div>
  </div>
</template>
