<script setup lang="ts">
  /* На планшете и телефоне разделы уезжают вниз: до них дотягивается большой
     палец, а шапка остаётся под поиск и профиль. */
  const { items, isActive } = useNav()
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-xl lg:hidden"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="Разделы кабинета — нижнее меню"
  >
    <div class="flex">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
        :class="isActive(item.to) ? 'text-brand-deep' : 'text-ink-3'"
      >
        <span class="relative">
          <AppIcon :name="item.icon" class="h-[19px] w-[19px]" />
          <UiBadge
            v-if="item.badge"
            :value="item.badge"
            size="sm"
            class="absolute -right-2.5 -top-1.5"
          />
        </span>
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
