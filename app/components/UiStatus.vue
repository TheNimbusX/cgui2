<script setup lang="ts">
  import type { Stage } from '~/utils/types'
  import { TONE_VAR, stage as meta } from '~/utils/stages'

  /* Статус — плашка без заливки: волосяная грань, точка тона и тёмный
     текст. Цвет остаётся подсказкой, а не украшением, и не конкурирует
     с единственным акцентом интерфейса. */
  const props = withDefaults(defineProps<{ stage: Stage; size?: 'sm' | 'md' }>(), { size: 'md' })

  const s = computed(() => meta(props.stage))
</script>

<template>
  <span
    class="status"
    :class="size === 'sm' ? '!px-2 !py-0.5 !text-[11px]' : ''"
    :style="{ '--tone': TONE_VAR[s.tone] }"
  >
    {{ s.label }}
  </span>
</template>
