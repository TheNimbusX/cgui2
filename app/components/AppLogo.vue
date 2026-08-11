<template>
  <!-- Знак «S» с логотипа компании: две дуги с диагональным разрезом.
       Без плашки и градиента — в этом дизайн-коде логотип это глиф,
       а не кнопка, и единственная заливка цветом отдана действиям. -->
  <span class="flex h-8 w-8 flex-none items-center justify-center text-ink" aria-hidden="true">
    <svg
      class="h-[26px] w-[26px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
    >
      <g transform="translate(12 12) skewX(-8) translate(-12 -12)">
        <path d="M16.8 7C15.8 5.2 12.6 4.5 10.3 5.4 7.5 6.5 7.3 9.7 10.1 11l.2.1" />
        <path d="M13.7 12.5l.2.1c2.8 1.3 2.6 4.5-.2 5.6-2.3.9-5.5.2-6.5-1.6" />
      </g>
    </svg>
  </span>
</template>
