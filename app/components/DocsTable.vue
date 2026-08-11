<script setup lang="ts">
  import type { Doc, DocKind, Tone } from '~/utils/types'
  import { TONE_VAR } from '~/utils/stages'
  import { date, money } from '~/utils/format'

  defineProps<{ rows: Doc[] }>()

  const KIND: Record<DocKind, { label: string; tone: Tone; icon: string }> = {
    contract: { label: 'Договор', tone: 'neutral', icon: 'company' },
    spec: { label: 'Спецификация', tone: 'info', icon: 'doc' },
    upd: { label: 'УПД', tone: 'ok', icon: 'file-check' },
    invoice: { label: 'Счёт', tone: 'warn', icon: 'invoice' },
    kp: { label: 'КП', tone: 'info', icon: 'doc' },
  }
</script>

<template>
  <div class="panel overflow-hidden">
    <div class="scroll-thin overflow-x-auto max-lg:hidden">
      <table class="grid-table min-w-[900px]">
        <thead>
          <tr>
            <th style="width: 260px">Документ</th>
            <th style="width: 112px">Дата</th>
            <th style="width: 128px">Заявка</th>
            <th>Позиция</th>
            <th class="num" style="width: 142px">Сумма</th>
            <th style="width: 88px"><span class="sr-only">Файл</span></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="d in rows" :key="d.id" class="transition-colors hover:bg-surface-2/70">
            <td>
              <div class="flex items-center gap-2.5">
                <span
                  class="tone-soft flex h-7 w-7 flex-none items-center justify-center rounded-full"
                  :style="{ '--tone': TONE_VAR[KIND[d.kind].tone] }"
                >
                  <AppIcon :name="KIND[d.kind].icon" class="h-4 w-4" />
                </span>
                <span class="min-w-0">
                  <span class="block truncate font-medium">{{ d.name }}</span>
                  <span class="block text-xs text-ink-3">{{ KIND[d.kind].label }}</span>
                </span>
              </div>
            </td>

            <td class="whitespace-nowrap text-ink-2">{{ date(d.date) }}</td>

            <td>
              <NuxtLink
                v-if="d.requestId"
                :to="`/requests/${d.requestId}`"
                class="font-medium text-brand-ink hover:underline"
              >
                {{ d.requestId }}
              </NuxtLink>
              <span v-else class="text-ink-3">—</span>
            </td>

            <td>
              <div class="truncate leading-snug">{{ d.item }}</div>
              <div class="mt-0.5 text-xs text-ink-3">{{ d.brand }} · {{ d.qty }} шт</div>
            </td>

            <td class="num whitespace-nowrap font-medium">
              {{ d.sum ? money(d.sum) : '—' }}
            </td>

            <td><UiPdf :name="`${d.name}.pdf`" :kind="d.kind === 'upd' ? 'upd' : 'pdf'" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- мобильный список -->
    <div class="divide-y divide-line-soft lg:hidden">
      <div v-for="d in rows" :key="d.id" class="flex items-start gap-3 px-4 py-3.5">
        <span
          class="tone-soft flex h-8 w-8 flex-none items-center justify-center rounded-full"
          :style="{ '--tone': TONE_VAR[KIND[d.kind].tone] }"
        >
          <AppIcon :name="KIND[d.kind].icon" class="h-4 w-4" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="font-medium leading-snug">{{ d.name }}</div>
          <div class="mt-0.5 text-xs text-ink-3">
            {{ KIND[d.kind].label }} · {{ date(d.date) }}
            <template v-if="d.requestId"> · {{ d.requestId }}</template>
          </div>
          <div class="mt-1 truncate text-xs text-ink-2">{{ d.item }}</div>
        </div>
        <UiPdf :name="`${d.name}.pdf`" :kind="d.kind === 'upd' ? 'upd' : 'pdf'" />
      </div>
    </div>

    <UiEmpty v-if="!rows.length" title="Документов нет" />
  </div>
</template>
