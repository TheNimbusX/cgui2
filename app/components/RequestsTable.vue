<script setup lang="ts">
  import type { Request } from '~/utils/types'
  import { date, money, pct } from '~/utils/format'
  import { stage } from '~/utils/stages'

  /* Общая таблица заявок: используется и на главной, и в разделе КП.
     Строка раскрывается на месте — так клиент видит детали, не теряя
     контекст списка (в прототипе для этого была отдельная страница). */
  defineProps<{ rows: Request[] }>()

  const open = ref<string | null>(null)

  /* Содержимое раскрытия монтируется при первом открытии и дальше живёт:
     сразу рендерить его для всех сорока двух строк — это лишние тысячи
     узлов, из-за которых тормозит и прокрутка, и переключение темы. */
  const mounted = ref(new Set<string>())

  const toggle = (id: string) => {
    open.value = open.value === id ? null : id
    if (open.value) mounted.value = new Set(mounted.value).add(id)
  }
</script>

<template>
  <div class="panel overflow-hidden">
    <!-- ========== десктоп ========== -->
    <div class="scroll-thin overflow-x-auto max-lg:hidden">
      <!-- Ширины заданы на th, а не в colgroup: часть колонок скрывается на
           ноутбуках, а colgroup при этом разъезжается с ячейками.
           «Кол-во» уходит первым — оно продублировано под названием позиции. -->
      <table class="grid-table min-w-[940px]">
        <thead>
          <tr>
            <th style="width: 128px">Заявка</th>
            <th style="width: 134px">КП</th>
            <th>Позиция</th>
            <th class="num max-xl:hidden" style="width: 80px">Кол-во</th>
            <th class="num" style="width: 142px">Сумма</th>
            <th style="width: 124px">Срок поставки</th>
            <th style="width: 190px">Статус</th>
            <th style="width: 44px"><span class="sr-only">Подробнее</span></th>
          </tr>
        </thead>

        <tbody v-for="r in rows" :key="r.id" class="transition-colors">
          <tr
            class="group cursor-pointer transition-colors hover:bg-surface-2/70"
            :class="open === r.id ? 'bg-wash/40' : ''"
            @click="toggle(r.id)"
          >
            <td :class="r.unread ? 'shadow-[inset_3px_0_0_rgb(var(--c-brand))]' : ''">
              <NuxtLink
                :to="`/requests/${r.id}`"
                class="font-medium text-brand-ink hover:underline"
                @click.stop
              >
                {{ r.id }}
              </NuxtLink>
              <div class="mt-0.5 text-xs text-ink-3">от {{ date(r.createdAt) }}</div>
            </td>

            <td>
              <template v-if="r.kpNo">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ r.kpNo }}</span>
                  <UiPdf v-if="r.detail" :name="`${r.kpNo}.pdf`" />
                </div>
                <div class="mt-0.5 text-xs text-ink-3">от {{ date(r.kpAt) }}</div>
              </template>
              <span v-else class="text-ink-3">—</span>
            </td>

            <td>
              <div class="font-medium leading-snug">{{ r.item }}</div>
              <div class="mt-0.5 text-xs text-ink-2">{{ r.brand }} · {{ r.qty }} шт</div>
            </td>

            <td class="num whitespace-nowrap text-ink-2 max-xl:hidden">{{ r.qty }} шт</td>

            <td class="num">
              <div class="whitespace-nowrap font-medium">{{ money(r.sum) }}</div>
              <div v-if="r.billed" class="mt-0.5 whitespace-nowrap text-xs text-ink-3">
                оплачено {{ pct(r.paid, r.billed) }} %
              </div>
            </td>

            <td class="whitespace-nowrap text-ink-2">
              {{ r.leadTime ?? '—' }}
              <div v-if="r.planAt" class="mt-0.5 text-xs text-ink-3">план {{ date(r.planAt) }}</div>
            </td>

            <td>
              <UiStatus :stage="r.stage" />
              <div class="mt-1.5 text-xs leading-snug text-ink-3">
                {{ stage(r.stage).next }}
              </div>
            </td>

            <td class="text-right">
              <AppIcon
                name="down"
                class="ml-auto h-4 w-4 text-ink-3 transition-transform duration-300"
                :class="{ 'rotate-180': open === r.id }"
              />
            </td>
          </tr>

          <tr>
            <td colspan="8" class="!border-b-0 !p-0">
              <UiCollapse :open="open === r.id">
                <div
                  v-if="mounted.has(r.id)"
                  class="border-b border-line-soft bg-surface-2/40 px-4 py-4"
                >
                  <RequestExpand :req="r" />
                </div>
              </UiCollapse>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ========== планшет и телефон ========== -->
    <div class="divide-y divide-line-soft lg:hidden">
      <RequestCard v-for="r in rows" :key="r.id" :req="r" />
    </div>

    <UiEmpty v-if="!rows.length" />
  </div>
</template>
