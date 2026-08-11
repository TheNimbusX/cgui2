<script setup lang="ts">
  import type { Request } from '~/utils/types'
  import { PROFILE } from '~/utils/data/catalog'
  import { date, money, num, pct } from '~/utils/format'
  import { stage } from '~/utils/stages'

  const props = defineProps<{ req: Request }>()

  const { toast } = useToast()

  const initials = computed(() =>
    props.req.manager.name
      .split(' ')
      .map((w) => w[0])
      .join(''),
  )

  /* Хронология собирается из дат самой заявки: если КП ещё нет, у строки
     нечего разворачивать «по составу» — но история и позиция есть всегда,
     поэтому раскрытие не бывает пустым. */
  const timeline = computed(() => {
    const r = props.req
    return [
      { label: 'Заявка принята', at: r.createdAt, done: true },
      { label: 'КП отправлено', at: r.kpAt, done: !!r.kpAt },
      { label: 'Счёт выставлен', at: r.invoiceAt, done: !!r.invoiceAt },
      { label: 'Заказ размещён', at: r.orderedAt, done: !!r.orderedAt },
      {
        label: r.stage === 'shipped' ? 'Отгружено' : 'Плановая поставка',
        at: r.planAt,
        done: r.stage === 'shipped',
      },
    ].filter((s) => s.at)
  })

  const comment = ref('')
  const send = () => {
    if (!comment.value.trim()) return
    comment.value = ''
    toast('Комментарий отправлен менеджеру и добавлен в чат по заявке')
  }
</script>

<template>
  <div class="flex gap-4 max-xl:flex-col">
    <div class="min-w-0 flex-1 space-y-4">
      <p class="flex items-center gap-2 text-sm text-ink-2">
        <AppIcon name="clock" class="h-4 w-4 flex-none text-ink-3" />
        {{ stage(req.stage).next }}
      </p>

      <!-- состав КП там, где спецификация уже пришла -->
      <template v-if="req.detail">
        <div>
          <h4 class="mb-2 text-xs font-medium tracking-[0.025em] text-ink-3">
            СОСТАВ {{ req.kpNo }}
          </h4>
          <KpLines :detail="req.detail" :limit="5" />
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink :to="`/kp/${req.id}`" class="btn-ghost">
            <AppIcon name="doc" class="h-4 w-4 text-brand-deep" />
            Все {{ req.detail.lines.length }} позиций
          </NuxtLink>
          <UiPdf :name="`${req.kpNo}.pdf`" />
        </div>
      </template>

      <!-- иначе — позиция и хронология: раскрытие всегда что-то показывает -->
      <template v-else>
        <div class="rounded-card border border-line bg-surface p-4">
          <h4 class="mb-3 text-xs font-medium tracking-[0.025em] text-ink-3">ПОЗИЦИЯ ЗАЯВКИ</h4>
          <p class="font-medium">{{ req.item }}</p>
          <p class="mt-0.5 text-sm text-ink-2">{{ req.brand }}</p>
          <dl class="mt-3 text-sm">
            <UiKv label="Количество">{{ num(req.qty) }} шт</UiKv>
            <UiKv label="Срок поставки">{{ req.leadTime ?? 'уточняется' }}</UiKv>
            <UiKv label="Сумма" strong>{{ money(req.sum) }}</UiKv>
          </dl>
        </div>
      </template>

      <div class="rounded-card border border-line bg-surface p-4">
        <h4 class="mb-3 text-xs font-medium tracking-[0.025em] text-ink-3">ХРОНОЛОГИЯ</h4>
        <ol class="space-y-2.5">
          <li v-for="t in timeline" :key="t.label" class="flex items-center gap-3 text-sm">
            <span
              class="h-1.5 w-1.5 flex-none rounded-full"
              :class="t.done ? 'bg-brand' : 'bg-line-strong'"
              aria-hidden="true"
            />
            <span :class="t.done ? 'text-ink' : 'text-ink-2'">{{ t.label }}</span>
            <span class="ml-auto tabular-nums text-ink-2">{{ date(t.at!) }}</span>
          </li>
        </ol>
      </div>

      <!-- обращение к менеджеру прямо из строки -->
      <div class="rounded-card border border-line bg-surface-2/50 p-4">
        <label class="mb-2 block text-sm font-medium" :for="`c-${req.id}`">Вопрос по заявке</label>
        <textarea
          :id="`c-${req.id}`"
          v-model="comment"
          rows="2"
          class="w-full resize-y rounded-field border border-line bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-brand"
          placeholder="Например: можно ли ускорить срок по позиции 4?"
        />
        <div class="mt-2.5 flex items-center gap-2">
          <button class="btn-primary disabled:opacity-40" :disabled="!comment.trim()" @click="send">
            Отправить
          </button>
          <NuxtLink to="/chat" class="btn-quiet">Перейти в чат</NuxtLink>
        </div>
      </div>
    </div>

    <!-- правая колонка: деньги и менеджер -->
    <aside class="w-[320px] flex-none space-y-3 max-xl:w-full">
      <div class="rounded-card border border-line bg-surface p-4">
        <dl class="text-sm">
          <UiKv label="Договор">{{ PROFILE.contract }}</UiKv>
          <UiKv label="Счёт">{{ req.invoiceNo ?? '—' }}</UiKv>
          <UiKv label="Выставлено">{{ req.billed ? money(req.billed) : '—' }}</UiKv>
          <UiKv label="Оплачено">
            <template v-if="req.billed">
              {{ money(req.paid) }}
              <span class="ml-1.5 text-ink-3">{{ pct(req.paid, req.billed) }} %</span>
            </template>
            <template v-else>—</template>
          </UiKv>
        </dl>

        <NuxtLink :to="`/requests/${req.id}`" class="btn-ghost mt-3 w-full">
          Открыть заявку
          <AppIcon name="arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3 rounded-card border border-line bg-surface p-4">
        <AppAvatar :initials="initials" size="lg" />
        <div class="min-w-0">
          <div class="truncate font-medium">{{ req.manager.name }}</div>
          <div class="text-xs text-ink-2">{{ req.manager.role }}</div>
          <a
            :href="`tel:${req.manager.phone.replace(/\s/g, '')}`"
            class="text-xs font-medium text-brand-deep hover:underline"
          >
            {{ req.manager.phone }}
          </a>
        </div>
      </div>
    </aside>
  </div>
</template>
