<script setup lang="ts">
  import type { Request } from '~/utils/types'
  import { date, money } from '~/utils/format'

  /* Заказы — это заявки, по которым уже выставлен счёт. Колонки подобраны
     под три вопроса снабженца: сколько платить, когда приедет, где документы. */
  defineProps<{ rows: Request[] }>()
</script>

<template>
  <div class="panel overflow-hidden">
    <div class="scroll-thin overflow-x-auto max-lg:hidden">
      <!-- На ноутбуках 1024–1280 колонка «Документы» скрывается, а УПД
           переезжает к счёту: иначе таблица уезжала вправо вместе со
           статусом — самой нужной колонкой. -->
      <table class="grid-table min-w-[980px]">
        <thead>
          <tr>
            <th style="width: 128px">Заявка</th>
            <th style="width: 150px">Счёт</th>
            <th>Позиция</th>
            <th class="num" style="width: 142px">Сумма</th>
            <th style="width: 126px">Оплата</th>
            <th style="width: 138px">Поставка</th>
            <th class="max-xl:hidden" style="width: 92px">Документы</th>
            <th style="width: 164px">Статус</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in rows" :key="r.id" class="transition-colors hover:bg-surface-2/70">
            <td>
              <NuxtLink
                :to="`/requests/${r.id}`"
                class="font-medium text-brand-ink hover:underline"
              >
                {{ r.id }}
              </NuxtLink>
              <div class="mt-0.5 text-xs text-ink-3">от {{ date(r.createdAt) }}</div>
            </td>

            <td>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium">{{ r.invoiceNo }}</span>
                <UiPdf :name="`Счёт ${r.invoiceNo}.pdf`" />
                <UiPdf v-if="r.hasUpd" :name="`УПД по ${r.id}.pdf`" kind="upd" class="xl:hidden" />
              </div>
              <div class="mt-0.5 text-xs text-ink-3">от {{ date(r.invoiceAt) }}</div>
            </td>

            <td>
              <div class="font-medium leading-snug">{{ r.item }}</div>
              <div class="mt-0.5 text-xs text-ink-2">{{ r.brand }} · {{ r.qty }} шт</div>
            </td>

            <td class="num whitespace-nowrap font-medium">{{ money(r.billed) }}</td>

            <td><PayBar :billed="r.billed" :paid="r.paid" /></td>

            <td class="text-ink-2">
              <DeliveryCell v-if="r.planAt" :req="r" />
              <span v-else class="text-ink-3">после оплаты</span>
            </td>

            <td class="max-xl:hidden">
              <UiPdf v-if="r.hasUpd" :name="`УПД по ${r.id}.pdf`" kind="upd" />
              <span v-else class="text-ink-3">—</span>
            </td>

            <td><UiStatus :stage="r.stage" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="divide-y divide-line-soft lg:hidden">
      <RequestCard v-for="r in rows" :key="r.id" :req="r" />
    </div>

    <UiEmpty v-if="!rows.length" title="Заказов нет">
      Как только счёт будет оплачен, заказ появится здесь с плановой датой поставки.
    </UiEmpty>
  </div>
</template>
