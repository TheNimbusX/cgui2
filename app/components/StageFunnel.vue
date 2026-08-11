<script setup lang="ts">
  import type { StageChip } from '~/composables/usePortal'
  import type { Tone } from '~/utils/types'
  import { TONE_VAR } from '~/utils/stages'
  import { money, plural } from '~/utils/format'

  /* Воронка заявок вместо абстрактной цветной полоски.
     Полоска показывала доли, но не отвечала ни на один вопрос: что за
     сегмент, сколько там денег, куда нажать. Здесь то же распределение
     читается словами — этап, количество, сумма — и работает фильтром. */
  const props = defineProps<{ items: StageChip[] }>()

  const model = defineModel<string>({ required: true })

  const rows = computed(() => props.items.filter((c) => c.key !== 'all' && c.count > 0))
  const max = computed(() => Math.max(...rows.value.map((c) => c.count), 1))
  const total = computed(() => props.items.find((c) => c.key === 'all'))
</script>

<template>
  <section class="panel overflow-hidden" aria-label="Заявки по этапам">
    <header class="flex items-baseline gap-3 border-b border-line px-5 py-3.5">
      <h2 class="font-display text-base tracking-heading">Воронка заявок</h2>
      <p v-if="total" class="text-xs text-ink-3">
        {{ total.count }} {{ plural(total.count, 'заявка', 'заявки', 'заявок') }} ·
        {{ money(total.sum) }}
      </p>
      <button
        v-if="model !== 'all'"
        class="ml-auto text-xs font-medium text-brand-deep hover:underline"
        @click="model = 'all'"
      >
        Сбросить фильтр
      </button>
    </header>

    <ul>
      <li v-for="c in rows" :key="c.key">
        <!-- На узком экране полоса-шкала уходит: на 360 px она вырождается
             в пару пикселей и только ломает строку. Остаются этап, число и
             сумма — то, ради чего сюда смотрят. -->
        <button
          class="flex w-full items-center gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors last:border-b-0 sm:gap-4 sm:px-5 sm:py-2.5"
          :class="model === c.key ? 'bg-wash/40' : 'hover:bg-surface-2/70'"
          :aria-pressed="model === c.key"
          @click="model = model === c.key ? 'all' : c.key"
        >
          <span class="flex min-w-0 flex-1 items-center gap-2.5 sm:w-[168px] sm:flex-none">
            <span
              class="h-1.5 w-1.5 flex-none rounded-full"
              :style="{ background: `rgb(${TONE_VAR[c.tone as Tone]})` }"
              aria-hidden="true"
            />
            <span class="truncate text-sm" :class="model === c.key ? 'text-ink' : 'text-ink-2'">
              {{ c.label }}
            </span>
          </span>

          <span class="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2 sm:flex">
            <span
              class="h-full rounded-full transition-[width,opacity] duration-500"
              :style="{
                width: `${(c.count / max) * 100}%`,
                background: `rgb(${TONE_VAR[c.tone as Tone]})`,
                opacity: model === 'all' || model === c.key ? 0.75 : 0.28,
              }"
            />
          </span>

          <span class="flex flex-none items-center justify-end gap-3">
            <span class="w-6 text-right text-sm font-medium tabular-nums sm:w-9">
              {{ c.count }}
            </span>
            <span class="whitespace-nowrap text-right text-sm text-ink-2 tabular-nums sm:w-[124px]">
              {{ c.sum ? money(c.sum) : '—' }}
            </span>
            <UiBadge v-if="c.unread" :value="c.unread" size="sm" />
            <span v-else class="w-4 flex-none" aria-hidden="true" />
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
