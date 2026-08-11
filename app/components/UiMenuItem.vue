<script setup lang="ts">
  defineProps<{ icon: string; danger?: boolean }>()
</script>

<template>
  <button
    class="flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-surface-2"
    :class="danger ? 'text-bad' : 'text-ink'"
    role="menuitem"
  >
    <AppIcon :name="icon" class="h-4 w-4 flex-none" :class="danger ? '' : 'text-ink-2'" />
    <slot />
  </button>
</template>
