<script setup lang="ts">
  import type { Stage } from '~/utils/types'

  /* Путь заявки из пяти шагов — то, что клиент проговаривает словами:
     «подали → получили КП → оплатили → едет → получили».
     Восемь внутренних этапов сворачиваются в эти пять. */
  const STEPS = ['Заявка', 'КП', 'Оплата', 'В пути', 'Получено']

  const INDEX: Record<Stage, number> = {
    processing: 0,
    clarify: 0,
    kp: 1,
    payment: 2,
    paid: 2,
    transit: 3,
    shipped: 4,
    canceled: 0,
  }

  const props = defineProps<{ stage: Stage }>()

  const current = computed(() => INDEX[props.stage])
  const canceled = computed(() => props.stage === 'canceled')
  const state = (i: number) =>
    canceled.value ? 'off' : i < current.value ? 'done' : i === current.value ? 'now' : 'off'
</script>

<template>
  <ol class="flex gap-1 max-sm:flex-col max-sm:gap-3">
    <li
      v-for="(s, i) in STEPS"
      :key="s"
      class="flex-1 max-sm:flex max-sm:items-center max-sm:gap-3"
    >
      <div class="flex items-center gap-2">
        <span
          class="flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 text-[10px] font-medium transition-colors"
          :class="{
            'border-soot bg-soot text-white': state(i) === 'done',
            'border-brand bg-surface text-brand-ink ring-4 ring-brand/15': state(i) === 'now',
            'border-line bg-surface text-ink-3': state(i) === 'off',
            'border-bad text-bad': canceled && i === 0,
          }"
        >
          <AppIcon v-if="state(i) === 'done'" name="check" class="h-3 w-3" :stroke="3" />
          <template v-else>{{ i + 1 }}</template>
        </span>

        <!-- соединитель: на мобильном не нужен, шаги идут столбиком -->
        <span
          v-if="i < STEPS.length - 1"
          class="h-0.5 flex-1 rounded-full transition-colors max-sm:hidden"
          :class="state(i) === 'done' ? 'bg-soot' : 'bg-line'"
        />
      </div>

      <div
        class="mt-2 text-xs max-sm:mt-0"
        :class="state(i) === 'off' ? 'text-ink-3' : 'font-medium text-ink'"
      >
        {{ s }}
      </div>
    </li>
  </ol>
</template>
