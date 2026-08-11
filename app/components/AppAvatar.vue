<script setup lang="ts">
  withDefaults(defineProps<{ initials: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })

  const CLS = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-[11px]',
    lg: 'h-11 w-11 text-sm',
  }
</script>

<template>
  <span
    class="inline-grid flex-none place-items-center rounded-full border border-line bg-surface-2 font-medium uppercase tracking-wide text-ink-2"
    :class="CLS[size]"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>
