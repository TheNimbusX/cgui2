<script setup lang="ts">
  import { PROFILE } from '~/utils/data/catalog'
  import logo from '~/assets/img/client-koltsovo.png'

  const { search } = usePortal()
  const { items, isActive } = useNav()
  const { theme, init, toggle } = useTheme()
  const { toast } = useToast()

  onMounted(init)

  const searchOpen = ref(false)
  const searchEl = ref<HTMLInputElement | null>(null)

  /* Поле поиска не ужимается: короткий placeholder, фиксированная ширина
     и переход в оверлей на узких экранах — иначе подсказка обрезается
     в середине слова и превращается в мусор. */
  const openSearch = async () => {
    searchOpen.value = true
    await nextTick()
    searchEl.value?.focus()
  }

  // закрытие снимает и фильтр: иначе список остаётся урезанным, а запроса не видно
  const closeSearch = () => {
    search.value = ''
    searchOpen.value = false
  }
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl">
    <!-- Три зоны с жёстким flex-none по краям: на ноутбуках 1024–1440 шапка
         раньше вылезала за экран и обрезалась вместе с профилем -->
    <div class="wrap flex h-16 items-center gap-3">
      <NuxtLink to="/" class="flex flex-none items-center gap-2.5" aria-label="Система Снабжения">
        <AppLogo />
        <span
          class="whitespace-nowrap font-display text-[15px] font-medium tracking-heading max-xl:hidden"
        >
          Система Снабжения
        </span>
      </NuxtLink>

      <!-- Поле поиска — единственный элемент шапки, который умеет ужиматься.
           Раньше запас добирала навигация (min-w-0): она сжималась ниже
           своего содержимого, и бейдж «Чат» наезжал на кнопку темы. -->
      <label
        class="flex h-9 min-w-[150px] max-w-[240px] flex-1 basis-[240px] items-center gap-2.5 rounded-field border border-line bg-surface-2/70 px-3 text-ink-3 transition-[border-color,background] focus-within:border-brand focus-within:bg-surface max-2xl:hidden"
      >
        <AppIcon name="search" class="h-4 w-4 flex-none" />
        <input
          v-model="search"
          type="text"
          class="w-full min-w-0 border-none bg-transparent text-sm text-ink outline-none"
          placeholder="Поиск по кабинету"
          aria-label="Поиск по заявкам, КП, счетам и документам"
        />
      </label>

      <nav
        class="mx-auto flex flex-none items-center gap-0.5 max-lg:hidden"
        aria-label="Разделы кабинета"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-wash/70 font-medium text-brand-deep'
              : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
          "
        >
          <AppIcon :name="item.icon" class="h-[17px] w-[17px] flex-none" />
          {{ item.label }}
          <UiBadge v-if="item.badge" :value="item.badge" />
        </NuxtLink>
      </nav>

      <div class="ml-auto flex flex-none items-center gap-1 lg:ml-0">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink 2xl:hidden"
          aria-label="Поиск"
          @click="openSearch"
        >
          <AppIcon name="search" class="h-[18px] w-[18px]" />
        </button>

        <button
          class="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
          :aria-label="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
          @click="toggle"
        >
          <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" class="h-[18px] w-[18px]" />
        </button>

        <UiDropdown class="max-sm:hidden">
          <template #trigger>
            <span class="btn-ghost h-9 !px-3.5">
              <AppIcon name="phone" class="h-4 w-4 text-brand-deep" />
              <span class="max-lg:hidden">Связь</span>
            </span>
          </template>
          <UiMenuItem icon="user" @click="toast('Менеджер получит уведомление и перезвонит')">
            Вызвать менеджера
          </UiMenuItem>
          <NuxtLink to="/chat"><UiMenuItem icon="chat">Написать в чат</UiMenuItem></NuxtLink>
          <div class="my-1 h-px bg-line-soft" />
          <UiMenuItem icon="alert" danger @click="toast('Обращение отправлено в поддержку')">
            Сообщить о проблеме
          </UiMenuItem>
        </UiDropdown>

        <!-- Профиль: логотип клиента остаётся на месте — по нему компанию
             узнают быстрее, чем по инициалам -->
        <UiDropdown>
          <template #trigger>
            <span
              class="flex items-center gap-2.5 rounded-full py-1 pl-2.5 transition-colors hover:bg-surface-2"
            >
              <span class="text-right leading-tight max-xl:hidden">
                <span class="block whitespace-nowrap text-sm font-medium">{{ PROFILE.short }}</span>
                <span class="block whitespace-nowrap text-xs text-ink-3">{{
                  PROFILE.company
                }}</span>
              </span>
              <img
                :src="logo"
                :alt="PROFILE.company"
                class="h-9 w-9 flex-none rounded-full border border-line bg-white object-contain p-1"
              />
            </span>
          </template>
          <div class="flex items-center gap-3 border-b border-line-soft px-3 pb-3 pt-1.5">
            <img
              :src="logo"
              alt=""
              class="h-10 w-10 flex-none rounded-full border border-line bg-white object-contain p-1"
            />
            <span class="min-w-0">
              <span class="block text-sm font-medium">{{ PROFILE.name }}</span>
              <span class="block text-xs text-ink-3">ИНН {{ PROFILE.inn }}</span>
            </span>
          </div>
          <UiMenuItem icon="user" @click="toast('Профиль появится в рабочей версии')">
            Профиль и реквизиты
          </UiMenuItem>
          <NuxtLink to="/docs"><UiMenuItem icon="folder">Мои документы</UiMenuItem></NuxtLink>
          <UiMenuItem icon="settings" @click="toast('Настройки появятся в рабочей версии')">
            Настройки уведомлений
          </UiMenuItem>
          <div class="my-1 h-px bg-line-soft" />
          <UiMenuItem icon="logout" danger @click="toast('Выход из демо недоступен')">
            Выйти
          </UiMenuItem>
        </UiDropdown>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- type="text", а не "search": системный крестик очистки дублировал
           бы кнопку закрытия — два крестика подряд читаются как ошибка -->
      <div v-if="searchOpen" class="absolute inset-0 flex items-center gap-3 bg-surface px-4">
        <AppIcon name="search" class="h-[18px] w-[18px] flex-none text-ink-3" />
        <input
          ref="searchEl"
          v-model="search"
          type="text"
          class="h-10 w-full border-none bg-transparent text-sm outline-none"
          placeholder="Заявка, КП, счёт или товар"
          @keydown.esc="closeSearch"
        />
        <button
          class="flex h-9 w-9 flex-none items-center justify-center rounded-full text-ink-2"
          aria-label="Закрыть поиск"
          @click="closeSearch"
        >
          <AppIcon name="close" class="h-[18px] w-[18px]" />
        </button>
      </div>
    </Transition>
  </header>
</template>
