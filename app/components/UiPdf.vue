<script setup lang="ts">
  /* Кнопка-документ. Файлов в демо нет, поэтому клик отдаёт тост —
     но выглядит и ведёт себя как настоящая ссылка на документ. */
  const props = withDefaults(defineProps<{ name: string; kind?: 'pdf' | 'upd' }>(), { kind: 'pdf' })

  const { toast } = useToast()

  const open = (e: Event) => {
    e.stopPropagation()
    toast(`${props.name} — файл откроется в рабочей версии кабинета`)
  }
</script>

<template>
  <button
    class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium leading-none text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
    :title="name"
    @click="open"
  >
    <AppIcon
      :name="kind === 'upd' ? 'file-check' : 'doc'"
      class="h-3.5 w-3.5"
      :class="kind === 'upd' ? 'text-ok' : 'text-ink-3'"
    />
    {{ kind === 'upd' ? 'УПД' : 'PDF' }}
  </button>
</template>
