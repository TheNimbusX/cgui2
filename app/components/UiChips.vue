<script setup lang="ts">
  import type { StageChip } from '~/composables/usePortal'
  import type { Tone } from '~/utils/types'
  import { TONE_VAR } from '~/utils/stages'

  defineProps<{ items: StageChip[]; label?: string }>()

  const model = defineModel<string>({ required: true })
</script>

<template>
  <div
    class="scroll-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    role="tablist"
    :aria-label="label"
  >
    <button
      v-for="c in items"
      :key="c.key"
      class="flex flex-none items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors"
      :class="
        model === c.key
          ? 'border-brand bg-wash/60 font-medium text-brand-deep'
          : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink'
      "
      role="tab"
      :aria-selected="model === c.key"
      @click="model = c.key"
    >
      <span
        v-if="c.key !== 'all'"
        class="h-1.5 w-1.5 flex-none rounded-full"
        :style="{ background: `rgb(${TONE_VAR[c.tone as Tone]})` }"
        aria-hidden="true"
      />
      {{ c.label }}
      <span class="tabular-nums" :class="model === c.key ? 'text-brand-deep/70' : 'text-ink-3'">
        {{ c.count }}
      </span>
      <!-- непрочитанные показываем только там, где они есть -->
      <UiBadge v-if="c.unread" :value="c.unread" size="sm" />
    </button>
  </div>
</template>
