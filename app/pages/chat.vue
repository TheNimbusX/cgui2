<script setup lang="ts">
  import type { ChatMessage } from '~/utils/types'
  import { THREADS } from '~/utils/data/chat'
  import { agoShort } from '~/utils/format'

  const { toast } = useToast()

  const activeId = ref(THREADS[0]!.requestId)
  const filter = ref('')
  const draft = ref('')
  const sent = ref<Record<string, ChatMessage[]>>({})
  const openOnMobile = ref(false)

  const deskView = ref<{ toBottom: () => void } | null>(null)
  const mobileView = ref<{ toBottom: () => void } | null>(null)

  /* «Печатает…» — состояние, а не украшение: индикатор появляется после
     отправки и гаснет вместе с ответом менеджера. */
  const typing = ref(false)
  let replyTimer: ReturnType<typeof setTimeout> | undefined

  const AUTO_REPLY =
    'Принял, спасибо. Уточню статус у поставщика и вернусь с ответом — обычно в течение 15 минут.'

  const threads = computed(() => {
    const q = filter.value.trim().toLowerCase()
    return THREADS.filter((t) => !q || `${t.requestId} ${t.subject}`.toLowerCase().includes(q))
  })

  const active = computed(() => THREADS.find((t) => t.requestId === activeId.value)!)

  const messages = computed(() => [...active.value.messages, ...(sent.value[activeId.value] ?? [])])

  /** Последняя реплика ветки — превью в списке */
  const preview = (id: string) => {
    const t = THREADS.find((x) => x.requestId === id)!
    const list = [...t.messages, ...(sent.value[id] ?? [])]
    const last = list[list.length - 1]!
    return { text: `${last.from === 'client' ? 'Вы: ' : ''}${last.text}`, ago: last.ago }
  }

  /* Разделитель дня ставим там, где меняется день — как в мессенджерах. */
  const dayOf = (m: ChatMessage) => (m.ago < 1440 ? 'Сегодня' : m.ago < 2880 ? 'Вчера' : 'Ранее')

  const feed = computed(() =>
    messages.value.map((m, i) => ({
      ...m,
      key: `${i}-${m.ago}`,
      day: i === 0 || dayOf(m) !== dayOf(messages.value[i - 1]!) ? dayOf(m) : null,
    })),
  )

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')

  const scrollDown = () => {
    deskView.value?.toBottom()
    mobileView.value?.toBottom()
  }

  const push = (msg: ChatMessage, id = activeId.value) => {
    sent.value = { ...sent.value, [id]: [...(sent.value[id] ?? []), msg] }
  }

  const select = (id: string) => {
    activeId.value = id
    openOnMobile.value = true
    typing.value = false
    nextTick(scrollDown)
  }

  const send = () => {
    const text = draft.value.trim()
    if (!text) return

    const id = activeId.value
    push({ from: 'client', text, ago: 0 }, id)
    draft.value = ''
    nextTick(scrollDown)

    // менеджер «набирает» и отвечает — иначе отправка выглядит как пустота
    typing.value = true
    clearTimeout(replyTimer)
    replyTimer = setTimeout(() => {
      typing.value = false
      push({ from: 'manager', text: AUTO_REPLY, ago: 0 }, id)
      nextTick(scrollDown)
    }, 2200)
  }

  /* Пока открыт полноэкранный чат, страница под ним не должна прокручиваться */
  watch(openOnMobile, (v) => {
    document.body.style.overflow = v ? 'hidden' : ''
  })

  onBeforeUnmount(() => {
    clearTimeout(replyTimer)
    document.body.style.overflow = ''
  })
</script>

<template>
  <div>
    <UiPageHead
      title="Чат по заявкам"
      subtitle="Переписка привязана к заявке — контекст не теряется при передаче менеджеру"
      :crumbs="[{ label: 'Главная', to: '/' }, { label: 'Чат' }]"
    />

    <!-- ========== десктоп: две колонки в одной панели ========== -->
    <div
      class="rise rise-2 flex overflow-hidden rounded-card lg:h-[calc(100vh-280px)] lg:min-h-[540px] lg:border lg:border-line lg:bg-surface lg:shadow-hair"
    >
      <aside
        class="flex min-h-0 w-full flex-col rounded-card border border-line bg-surface shadow-hair lg:w-[340px] lg:flex-none lg:rounded-none lg:border-0 lg:border-r lg:shadow-none"
      >
        <div class="flex-none border-b border-line p-3">
          <label
            class="flex h-9 items-center gap-2.5 rounded-field border border-line bg-surface-2/70 px-3 text-ink-3 transition-colors focus-within:border-brand focus-within:bg-surface"
          >
            <AppIcon name="search" class="h-4 w-4 flex-none" />
            <input
              v-model="filter"
              type="text"
              class="w-full border-none bg-transparent text-sm text-ink outline-none"
              placeholder="Номер заявки или бренд"
              aria-label="Поиск по чатам"
            />
          </label>
        </div>

        <!-- на телефоне список едет вместе со страницей: вложенный скролл
             внутри скролла — главное, что раздражает в мобильных чатах -->
        <div class="scroll-thin min-h-0 lg:flex-1 lg:overflow-y-auto">
          <button
            v-for="t in threads"
            :key="t.requestId"
            class="relative flex w-full items-start gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors last:border-b-0"
            :class="
              t.requestId === activeId
                ? 'bg-wash/45 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-brand max-lg:bg-transparent max-lg:before:hidden'
                : 'hover:bg-surface-2/70'
            "
            :aria-current="t.requestId === activeId ? 'true' : undefined"
            @click="select(t.requestId)"
          >
            <AppAvatar :initials="initials(t.manager.name)" size="lg" />

            <span class="min-w-0 flex-1">
              <span class="flex items-baseline gap-2">
                <span class="truncate text-sm font-medium text-ink">{{ t.requestId }}</span>
                <span class="ml-auto flex-none text-[11px] text-ink-3">
                  {{ agoShort(preview(t.requestId).ago) }}
                </span>
              </span>

              <span class="mt-0.5 block truncate text-xs text-ink-3">{{ t.subject }}</span>

              <span class="mt-1 flex items-center gap-2">
                <span class="min-w-0 flex-1 truncate text-xs text-ink-2">
                  {{ preview(t.requestId).text }}
                </span>
                <UiBadge v-if="t.unread" :value="t.unread" size="sm" />
              </span>
            </span>
          </button>

          <UiEmpty v-if="!threads.length" title="Чатов не найдено" />
        </div>
      </aside>

      <ChatThreadView
        ref="deskView"
        v-model="draft"
        class="max-lg:hidden"
        :thread="active"
        :feed="feed"
        :typing="typing"
        @send="send"
        @attach="toast('Загрузка файлов появится в рабочей версии')"
      />
    </div>

    <!-- ========== телефон: беседа занимает весь экран ========== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-x-6 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="translate-x-6 opacity-0"
      >
        <div v-if="openOnMobile" class="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden">
          <ChatThreadView
            ref="mobileView"
            v-model="draft"
            with-back
            :thread="active"
            :feed="feed"
            :typing="typing"
            @send="send"
            @back="openOnMobile = false"
            @attach="toast('Загрузка файлов появится в рабочей версии')"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
