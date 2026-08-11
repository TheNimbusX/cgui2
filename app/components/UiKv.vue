<script setup lang="ts">
  defineProps<{ label: string; strong?: boolean }>()
</script>

<template>
  <div
    class="flex items-baseline justify-between gap-6 border-b border-line-soft py-2.5 last:border-b-0"
    :class="strong ? 'text-[15px] font-medium' : ''"
  >
    <dt class="flex-none" :class="strong ? 'text-ink' : 'text-ink-2'">{{ label }}</dt>
    <dd class="text-right" :class="strong ? '' : 'font-medium'"><slot /></dd>
  </div>
</template>
