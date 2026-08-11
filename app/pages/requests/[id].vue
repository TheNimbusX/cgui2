<script setup lang="ts">
  import { PROFILE } from '~/utils/data/catalog'
  import { byId } from '~/utils/data/requests'
  import { ago, date, money, pct } from '~/utils/format'
  import { stage } from '~/utils/stages'

  const route = useRoute()
  const req = computed(() => byId(String(route.params.id)))

  const acc = reactive({ kp: true, pay: false, delivery: false, req: false, mgr: false })

  const metrics = computed(() => {
    const r = req.value
    if (!r) return []
    return [
      { label: 'Сумма заявки', value: money(r.sum) },
      { label: 'Выставлено', value: r.billed ? money(r.billed) : '—' },
      {
        label: 'Оплачено',
        value: r.paid ? money(r.paid) : '—',
        tone: r.paid ? 'var(--c-ok)' : undefined,
      },
      {
        label: 'Остаток',
        value: money(r.billed - r.paid),
        tone: r.billed - r.paid > 0 ? 'var(--c-warn)' : undefined,
      },
    ]
  })
</script>

<template>
  <div v-if="req">
    <UiPageHead
      :title="req.id"
      :subtitle="`${req.item} · ${req.brand}`"
      :crumbs="[{ label: 'Главная', to: '/' }, { label: 'Заявки', to: '/' }, { label: req.id }]"
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <UiStatus :stage="req.stage" />
          <NuxtLink to="/chat" class="btn-ghost">
            <AppIcon name="chat" class="h-4 w-4 text-brand-deep" />
            Написать менеджеру
          </NuxtLink>
        </div>
      </template>
    </UiPageHead>

    <!-- путь заявки -->
    <section class="rise rise-2 panel mb-4 p-5">
      <StageSteps :stage="req.stage" />
      <p class="mt-4 flex items-center gap-2 border-t border-line-soft pt-4 text-sm text-ink-2">
        <AppIcon name="clock" class="h-4 w-4 flex-none text-ink-3" />
        {{ stage(req.stage).next }}
        <span class="text-ink-3">· обновлено {{ ago(req.updatedAt) }}</span>
      </p>
    </section>

    <!-- деньги -->
    <section class="rise rise-3 panel mb-4 flex flex-wrap gap-x-10 gap-y-5 p-5">
      <UiStat
        v-for="m in metrics"
        :key="m.label"
        class="flex-1 basis-[150px]"
        :label="m.label"
        :value="m.value"
        :tone="m.tone"
      />
      <div v-if="req.billed" class="flex-1 basis-[150px]">
        <div class="text-xs font-medium tracking-[0.025em] text-ink-3">Оплата</div>
        <PayBar class="mt-1.5 !max-w-none" :billed="req.billed" :paid="req.paid" />
      </div>
    </section>

    <div class="grid grid-cols-3 gap-4 max-xl:grid-cols-1">
      <div class="rise rise-4 col-span-2 space-y-3 max-xl:col-span-1">
        <UiAccordion
          v-model="acc.kp"
          title="Коммерческое предложение"
          icon="doc"
          :aside="req.kpNo ?? 'ещё не сформировано'"
        >
          <template v-if="req.detail">
            <KpLines :detail="req.detail" :limit="6" />
            <NuxtLink
              :to="`/kp/${req.id}`"
              class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-ink hover:underline"
            >
              Открыть КП целиком
              <AppIcon name="arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </template>
          <dl v-else class="text-sm">
            <UiKv label="Номер КП">{{ req.kpNo ?? '—' }}</UiKv>
            <UiKv label="Дата">{{ date(req.kpAt) }}</UiKv>
            <UiKv label="Срок поставки">{{ req.leadTime ?? '—' }}</UiKv>
            <UiKv label="Позиция">{{ req.item }} × {{ req.qty }}</UiKv>
            <UiKv label="Итого" strong>{{ money(req.sum) }}</UiKv>
          </dl>
        </UiAccordion>

        <UiAccordion
          v-model="acc.pay"
          title="Счёт и платежи"
          icon="wallet"
          :aside="req.billed ? `оплачено ${pct(req.paid, req.billed)} %` : 'счёт не выставлен'"
        >
          <dl class="text-sm">
            <UiKv label="Счёт">{{ req.invoiceNo ?? '—' }}</UiKv>
            <UiKv label="Дата счёта">{{ date(req.invoiceAt) }}</UiKv>
            <UiKv label="Выставлено">{{ req.billed ? money(req.billed) : '—' }}</UiKv>
            <UiKv label="Оплачено">{{ req.paid ? money(req.paid) : '—' }}</UiKv>
            <UiKv label="Остаток" strong>{{ money(req.billed - req.paid) }}</UiKv>
          </dl>
        </UiAccordion>

        <UiAccordion
          v-model="acc.delivery"
          title="Поставка"
          icon="truck"
          :aside="req.planAt ? `план ${date(req.planAt)}` : 'после оплаты'"
        >
          <dl class="text-sm">
            <UiKv label="Заказан у поставщика">{{ date(req.orderedAt) }}</UiKv>
            <UiKv label="Срок поставки">{{ req.leadTime ?? '—' }}</UiKv>
            <UiKv label="Плановая дата">{{ date(req.planAt) }}</UiKv>
            <UiKv label="Закрывающие документы">
              {{ req.hasUpd ? 'УПД готов' : 'после отгрузки' }}
            </UiKv>
          </dl>
        </UiAccordion>

        <UiAccordion v-model="acc.req" title="Реквизиты" icon="folder" :aside="PROFILE.company">
          <dl class="text-sm">
            <UiKv label="Компания">{{ PROFILE.company }}</UiKv>
            <UiKv label="ИНН / КПП">{{ PROFILE.inn }} / {{ PROFILE.kpp }}</UiKv>
            <UiKv label="Договор"> {{ PROFILE.contract }} от {{ date(PROFILE.contractAt) }} </UiKv>
            <UiKv label="Контакт">{{ PROFILE.name }}</UiKv>
            <UiKv label="Адрес доставки">{{ PROFILE.address }}</UiKv>
          </dl>
        </UiAccordion>
      </div>

      <!-- менеджер и документы -->
      <aside class="rise rise-5 space-y-3">
        <section class="panel p-5">
          <h3 class="mb-3 text-xs font-medium tracking-[0.025em] text-ink-3">Ваш менеджер</h3>
          <div class="flex items-center gap-3">
            <AppAvatar
              :initials="
                req.manager.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
              "
              size="lg"
            />
            <div class="min-w-0">
              <div class="font-medium">{{ req.manager.name }}</div>
              <div class="text-xs text-ink-2">{{ req.manager.role }}</div>
            </div>
          </div>
          <dl class="mt-3 text-sm">
            <UiKv label="Телефон">
              <a :href="`tel:${req.manager.phone.replace(/\s/g, '')}`" class="text-brand-ink">
                {{ req.manager.phone }}
              </a>
            </UiKv>
            <UiKv label="E-mail">
              <a :href="`mailto:${req.manager.email}`" class="text-brand-ink">{{
                req.manager.email
              }}</a>
            </UiKv>
          </dl>
        </section>

        <section class="panel p-5">
          <h3 class="mb-3 text-xs font-medium tracking-[0.025em] text-ink-3">
            Документы по заявке
          </h3>
          <div class="flex flex-wrap gap-2">
            <UiPdf v-if="req.kpNo" :name="`${req.kpNo}.pdf`" />
            <UiPdf v-if="req.invoiceNo" :name="`Счёт ${req.invoiceNo}.pdf`" />
            <UiPdf v-if="req.hasUpd" :name="`УПД по ${req.id}.pdf`" kind="upd" />
            <span v-if="!req.kpNo && !req.invoiceNo" class="text-sm text-ink-3">
              Появятся после согласования КП
            </span>
          </div>
          <NuxtLink
            to="/docs"
            class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-ink hover:underline"
          >
            Все документы
            <AppIcon name="arrow-right" class="h-4 w-4" />
          </NuxtLink>
        </section>
      </aside>
    </div>
  </div>

  <div v-else class="panel">
    <UiEmpty title="Заявка не найдена">
      Проверьте номер или вернитесь к
      <NuxtLink to="/" class="text-brand-ink">списку заявок</NuxtLink>.
    </UiEmpty>
  </div>
</template>
