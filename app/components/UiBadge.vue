<script setup lang="ts">
  /* Счётчик непрочитанного. Заливка — тёмная нейтраль, а не циан:
     циан в этом дизайн-коде зарезервирован за действиями, и если им
     красить ещё и бейджи, он перестаёт означать «сюда нажимать».

     Цифра центрируется сеткой (place-items) — так она не зависит от
     метрик шрифта, в отличие от flex + line-height. */
  withDefaults(defineProps<{ value: number | string; size?: 'sm' | 'md' }>(), { size: 'md' })
</script>

<template>
  <span
    class="inline-grid flex-none place-items-center rounded-full bg-soot font-medium leading-none text-white tabular-nums"
    :class="
      size === 'sm' ? 'h-4 min-w-4 px-1 text-[10px]' : 'h-[18px] min-w-[18px] px-1.5 text-[11px]'
    "
  >
    <span class="block">{{ value }}</span>
  </span>
</template>
