<script setup lang="ts">
  import type { ChatThread, ChatMessage } from '~/utils/types'
  import { agoShort } from '~/utils/format'

  /* Переписка одной заявки: шапка, лента и поле ввода.
     Один компонент на две раскладки — колонка на десктопе и полный экран
     на телефоне, — чтобы разметка беседы не разъезжалась между ними. */
  defineProps<{
    thread: ChatThread
    feed: (ChatMessage & { key: string; day: string | null })[]
    typing: boolean
    /** мобильный режим: показываем кнопку «назад» */
    withBack?: boolean
  }>()

  const emit = defineEmits<{ send: []; back: []; attach: [] }>()

  const draft = defineModel<string>({ required: true })

  const body = ref<HTMLElement | null>(null)

  const toBottom = async () => {
    await nextTick()
    if (body.value) body.value.scrollTop = body.value.scrollHeight
  }

  defineExpose({ toBottom })
  onMounted(toBottom)

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <header class="flex flex-none items-center gap-3 border-b border-line bg-surface px-4 py-3">
      <button
        v-if="withBack"
        class="-ml-1 flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink-2"
        aria-label="К списку чатов"
        @click="emit('back')"
      >
        <AppIcon name="left" class="h-5 w-5" />
      </button>

      <AppAvatar :initials="initials(thread.manager.name)" />
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <NuxtLink
            :to="`/requests/${thread.requestId}`"
            class="font-medium text-brand-ink hover:underline"
          >
            {{ thread.requestId }}
          </NuxtLink>
          <span class="truncate text-xs text-ink-3 max-sm:hidden">{{ thread.subject }}</span>
        </div>
        <div class="truncate text-xs text-ink-2">
          {{ thread.manager.name }} · {{ thread.manager.role }}
        </div>
      </div>

      <a
        :href="`tel:${thread.manager.phone.replace(/\s/g, '')}`"
        class="btn-ghost ml-auto h-9 flex-none !px-3.5"
      >
        <AppIcon name="phone" class="h-4 w-4 text-brand-deep" />
        <span class="max-sm:hidden">Позвонить</span>
      </a>
    </header>

    <!-- единственная прокручиваемая область беседы -->
    <div ref="body" class="scroll-thin min-h-0 flex-1 space-y-3 overflow-y-auto bg-bg p-4">
      <template v-for="m in feed" :key="m.key">
        <div v-if="m.day" class="flex justify-center py-1">
          <span class="rounded-full border border-line bg-surface px-3 py-1 text-[11px] text-ink-3">
            {{ m.day }}
          </span>
        </div>

        <div class="flex" :class="m.from === 'client' ? 'justify-end' : 'justify-start'">
          <div class="max-w-[min(560px,82%)]">
            <div
              class="rounded-feature px-3.5 py-2.5 text-sm leading-relaxed"
              :class="
                m.from === 'client'
                  ? 'rounded-br-md bg-brand text-white'
                  : 'rounded-bl-md border border-line bg-surface'
              "
            >
              {{ m.text }}
            </div>
            <div
              class="mt-1 text-[11px] text-ink-3"
              :class="m.from === 'client' ? 'text-right' : ''"
            >
              {{ m.ago === 0 ? 'только что' : agoShort(m.ago) }}
            </div>
          </div>
        </div>
      </template>

      <div v-if="typing" class="flex items-center gap-2 pl-1 text-xs text-ink-3">
        <span class="typing flex gap-1"><i /><i /><i /></span>
        {{ thread.manager.name.split(' ')[0] }} печатает…
      </div>
    </div>

    <div
      class="flex-none border-t border-line bg-surface p-3"
      style="padding-bottom: max(0.75rem, env(safe-area-inset-bottom))"
    >
      <div
        class="flex items-end gap-2 rounded-feature border border-line bg-surface p-1.5 transition-colors focus-within:border-brand"
      >
        <button
          class="flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          aria-label="Прикрепить файл"
          @click="emit('attach')"
        >
          <AppIcon name="clip" class="h-[18px] w-[18px]" />
        </button>

        <textarea
          v-model="draft"
          rows="1"
          class="max-h-32 min-h-[36px] w-full resize-none border-none bg-transparent py-2 text-sm outline-none"
          placeholder="Написать менеджеру…"
          @keydown.enter.exact.prevent="emit('send')"
        />

        <button
          class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-deep disabled:opacity-30"
          :disabled="!draft.trim()"
          aria-label="Отправить"
          @click="emit('send')"
        >
          <AppIcon name="send" class="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  </div>
</template>
