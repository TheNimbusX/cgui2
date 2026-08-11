<script setup lang="ts">
  /* Меню в шапке: закрывается кликом вне и по Esc, фокус не крадёт. */
  defineProps<{ align?: 'left' | 'right' }>()

  const open = ref(false)
  const root = ref<HTMLElement | null>(null)

  const onDocClick = (e: MouseEvent) => {
    if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open.value = false
  }

  onMounted(() => {
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', onDocClick)
    document.removeEventListener('keydown', onKey)
  })

  defineExpose({ close: () => (open.value = false) })
</script>

<template>
  <div ref="root" class="relative">
    <button
      class="flex items-center rounded-lg transition-colors"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <slot name="trigger" :open="open" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="absolute top-[calc(100%+8px)] z-50 min-w-[228px] rounded-card border border-line bg-surface p-1.5 shadow-pop"
        :class="align === 'left' ? 'left-0' : 'right-0'"
        role="menu"
        @click="open = false"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
