<script setup lang="ts">
  defineProps<{ label: string; value: string; note?: string; tone?: string }>()
</script>

<template>
  <div class="min-w-0">
    <div class="text-xs font-medium tracking-[0.025em] text-ink-3">{{ label }}</div>
    <div
      class="mt-1.5 truncate font-display text-xl font-normal leading-none tracking-heading"
      :style="tone ? { color: `rgb(${tone})` } : undefined"
    >
      {{ value }}
    </div>
    <div v-if="note" class="mt-1.5 text-xs text-ink-2">{{ note }}</div>
  </div>
</template>
