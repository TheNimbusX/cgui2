<script setup lang="ts">
  defineProps<{
    title: string
    subtitle?: string
    /** Хлебные крошки: последняя — текущая страница, без ссылки */
    crumbs?: { label: string; to?: string }[]
  }>()
</script>

<template>
  <header class="rise rise-1 mb-6">
    <nav v-if="crumbs?.length" class="mb-3 flex items-center gap-1.5 text-xs text-ink-3">
      <template v-for="(c, i) in crumbs" :key="c.label">
        <NuxtLink v-if="c.to" :to="c.to" class="transition-colors hover:text-ink">
          {{ c.label }}
        </NuxtLink>
        <span v-else class="text-ink-2">{{ c.label }}</span>
        <span v-if="i < crumbs.length - 1" aria-hidden="true">/</span>
      </template>
    </nav>

    <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div class="min-w-0">
        <!-- Заголовок нормального начертания с плотным трекингом:
             вес не нужен, размер и воздух держат иерархию сами -->
        <h1 class="font-display text-[32px] leading-tight tracking-heading">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1.5 text-ink-2">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>
  </header>
</template>
