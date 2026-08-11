<script setup lang="ts">
  defineProps<{ title: string; icon: string; aside?: string }>()

  const open = defineModel<boolean>({ default: false })
</script>

<template>
  <section class="panel overflow-hidden">
    <button
      class="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-2"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span
        class="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line bg-surface-2 text-ink-2"
      >
        <AppIcon :name="icon" class="h-4 w-4" />
      </span>
      <span class="font-medium">{{ title }}</span>
      <span v-if="aside" class="ml-auto truncate text-ink-2">{{ aside }}</span>
      <AppIcon
        name="down"
        class="h-4 w-4 flex-none text-ink-3 transition-transform duration-300"
        :class="{ 'rotate-180': open, 'ml-auto': !aside }"
      />
    </button>

    <UiCollapse :open="open">
      <div class="border-t border-line-soft px-5 py-4">
        <slot />
      </div>
    </UiCollapse>
  </section>
</template>
