<script setup lang="ts">
  import { pct } from '~/utils/format'

  const props = defineProps<{ billed: number; paid: number }>()

  const value = computed(() => pct(props.paid, props.billed))
</script>

<template>
  <div class="w-full max-w-[112px]">
    <div class="flex items-baseline justify-between gap-2 text-xs">
      <span class="font-medium tabular-nums" :class="value === 100 ? 'text-ok' : 'text-ink-2'">
        {{ value }} %
      </span>
      <span v-if="value === 100" class="text-ink-3">оплачен</span>
    </div>
    <div
      class="mt-1 h-1.5 overflow-hidden rounded-full bg-line"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="h-full rounded-full transition-[width] duration-700 ease-out"
        :class="value === 100 ? 'bg-ok' : 'bg-warn'"
        :style="{ width: `${value}%` }"
      />
    </div>
  </div>
</template>
