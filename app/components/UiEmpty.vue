<script setup lang="ts">
  defineProps<{ title?: string }>()
</script>

<template>
  <div class="flex flex-col items-center gap-2 px-6 py-16 text-center">
    <span
      class="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink-3"
    >
      <AppIcon name="search" class="h-5 w-5" />
    </span>
    <p class="font-medium">{{ title ?? 'Ничего не найдено' }}</p>
    <p class="max-w-[380px] text-ink-2">
      <slot>Измените фильтр или поисковый запрос — либо спросите менеджера в чате.</slot>
    </p>
  </div>
</template>
