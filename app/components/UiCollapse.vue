<script setup lang="ts">
  /* Раскрытие с анимацией высоты — общий механизм для всех
     разворачивающихся блоков портала: строк таблицы и аккордеонов.

     Почему не CSS-переход:
     — grid 0fr→1fr не работает внутри ячейки таблицы (там `1fr` считается
       от высоты строки, а она сама зависит от содержимого);
     — любой глобальный `transition-duration: 0` (например, из правил
       prefers-reduced-motion) молча убивает переход, и блок открывается
       рывком. Web Animations задаёт длительность явно.

     Итоговая высота при этом всегда проставлена инлайном, поэтому даже
     если анимация не проиграет (фоновая вкладка, нет кадров), блок
     останется в правильном состоянии. */
  const props = defineProps<{ open: boolean; duration?: number }>()

  const EASING = 'cubic-bezier(0.32, 0.72, 0.28, 1)'

  const root = ref<HTMLElement | null>(null)
  const inner = ref<HTMLElement | null>(null)
  const height = ref(0)

  let observer: ResizeObserver | undefined
  let anim: Animation | undefined

  const measure = () => {
    height.value = inner.value?.scrollHeight ?? 0
  }

  /** При системном «меньше движения» не выключаем анимацию, а укорачиваем */
  const speed = () => {
    const base = props.duration ?? 320
    const reduced =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    return reduced ? Math.round(base * 0.55) : base
  }

  watch(
    () => props.open,
    async (opening) => {
      const el = root.value
      if (!el) return

      const from = el.getBoundingClientRect().height

      // сначала фиксируем конечное состояние в стиле, потом «доезжаем» до него
      if (opening) {
        await nextTick()
        measure()
      }
      const to = opening ? height.value : 0
      await nextTick()

      if (typeof el.animate !== 'function') return
      anim?.cancel()
      anim = el.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: speed(),
        easing: EASING,
      })
    },
  )

  onMounted(() => {
    measure()
    observer = new ResizeObserver(measure)
    if (inner.value) observer.observe(inner.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    anim?.cancel()
  })

  // скрытое содержимое не должно ловить фокус и попадать в озвучку
  const hidden = computed(() => !props.open)
</script>

<template>
  <div
    ref="root"
    class="ui-collapse"
    :style="{ height: open ? `${height}px` : '0px' }"
    :data-open="open"
    :aria-hidden="hidden || undefined"
    :inert="hidden || undefined"
  >
    <div ref="inner" class="ui-collapse-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .ui-collapse {
    overflow: hidden;
  }

  /* Содержимое чуть подтаивает сверху — раскрытие читается мягче,
     чем резкое появление блока целиком. */
  .ui-collapse-body {
    transition:
      opacity 0.22s ease,
      transform 0.3s cubic-bezier(0.32, 0.72, 0.28, 1);
  }

  .ui-collapse[data-open='false'] .ui-collapse-body {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
