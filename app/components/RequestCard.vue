<script setup lang="ts">
  import type { Request } from '~/utils/types'
  import { date, money, pct } from '~/utils/format'
  import { stage } from '~/utils/stages'

  /* Мобильный вид строки: на телефоне таблица из восьми колонок
     нечитаема, поэтому та же информация складывается в карточку. */
  defineProps<{ req: Request }>()
</script>

<template>
  <NuxtLink
    :to="`/requests/${req.id}`"
    class="block px-4 py-3.5 transition-colors active:bg-surface-2"
    :class="req.unread ? 'shadow-[inset_3px_0_0_rgb(var(--c-brand))]' : ''"
  >
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-brand-ink">{{ req.id }}</span>
      <span v-if="req.kpNo" class="text-xs text-ink-3">· {{ req.kpNo }}</span>
      <UiStatus :stage="req.stage" size="sm" class="ml-auto" />
    </div>

    <div class="mt-2 font-medium leading-snug">{{ req.item }}</div>
    <div class="text-xs text-ink-2">{{ req.brand }} · {{ req.qty }} шт</div>

    <div class="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span class="font-medium tabular-nums">{{ money(req.sum) }}</span>
      <span v-if="req.billed" class="text-xs text-ink-3">
        оплачено {{ pct(req.paid, req.billed) }} %
      </span>
      <span v-if="req.leadTime" class="text-xs text-ink-3">срок {{ req.leadTime }}</span>
      <span v-if="req.planAt" class="text-xs text-ink-3">план {{ date(req.planAt) }}</span>
    </div>

    <div class="mt-1.5 text-xs text-ink-3">{{ stage(req.stage).next }}</div>
  </NuxtLink>
</template>
