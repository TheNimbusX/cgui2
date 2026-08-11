<script setup lang="ts">
  import { NuxtLink } from '#components'
  import type { Tone } from '~/utils/types'
  import { TONE_VAR } from '~/utils/stages'
  import { money } from '~/utils/format'

  /* Верхний блок главной. Правило одно: сюда попадает только то,
     где следующий ход за клиентом. Всё остальное живёт в таблице.

     `:is` принимает сам компонент, а не строку с именем: строку Vue
     резолвит только для глобально зарегистрированных компонентов, иначе
     в разметку попадает тег <nuxtlink> и карточка перестаёт быть ссылкой. */
  const { attention } = usePortal()

  const ICONS: Record<string, string> = {
    kp: 'doc',
    payment: 'invoice',
    clarify: 'clock',
    overdue: 'alert',
  }
</script>

<template>
  <div class="grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1">
    <component
      :is="card.count ? NuxtLink : 'div'"
      v-for="(card, i) in attention"
      :key="card.key"
      :to="card.count ? card.to : undefined"
      class="panel rise group flex items-start gap-3.5 p-5 transition-[border-color,box-shadow,transform]"
      :class="[
        `rise-${i + 1}`,
        card.count ? 'hover:-translate-y-px hover:border-line-strong hover:shadow-card' : '',
      ]"
      :style="{ '--tone': TONE_VAR[card.tone as Tone] }"
    >
      <span class="tone-soft flex h-9 w-9 flex-none items-center justify-center rounded-full">
        <AppIcon :name="ICONS[card.key] ?? 'doc'" class="h-[18px] w-[18px]" />
      </span>

      <span class="min-w-0 flex-1">
        <span class="flex items-baseline gap-2">
          <span class="font-display text-2xl tracking-heading">{{ card.count }}</span>
          <span class="truncate text-sm font-medium">{{ card.label }}</span>
        </span>

        <span class="mt-1.5 block text-xs leading-snug text-ink-3">{{ card.note }}</span>

        <span v-if="card.sum" class="mt-2 block text-sm font-medium tabular-nums">
          {{ money(card.sum) }}
        </span>
      </span>

      <AppIcon
        v-if="card.count"
        name="arrow-right"
        class="h-4 w-4 flex-none text-ink-3 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-brand-deep"
      />
    </component>
  </div>
</template>
