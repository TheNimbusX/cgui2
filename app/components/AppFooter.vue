<script setup lang="ts">
  const links = ['Профиль', 'Документы', 'Поддержка']
  const { toast } = useToast()
</script>

<template>
  <footer class="mt-10 border-t border-line-soft py-6 text-xs text-ink-3 max-lg:mb-16">
    <div class="wrap flex flex-wrap items-center gap-x-6 gap-y-2">
      <span><span class="font-medium text-ink-2">Система Снабжения</span> · клиентский портал</span>
      <span class="flex gap-4">
        <button
          v-for="l in links"
          :key="l"
          class="transition-colors hover:text-brand-ink"
          @click="toast(`Раздел «${l}» появится в рабочей версии`)"
        >
          {{ l }}
        </button>
      </span>
      <span class="ml-auto">© 2026</span>
    </div>
  </footer>
</template>
