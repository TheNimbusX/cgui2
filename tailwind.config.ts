import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{vue,js,ts}'],

  // Тёмная тема — атрибут data-theme на <html> (ставится в useTheme и в head-скрипте)
  darkMode: ['class', '[data-theme="dark"]'],

  theme: {
    extend: {
      fontFamily: {
        // Inter — весь UI и текст; Inter Tight — заголовки (замена Roobert)
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
      },

      // Единый источник цвета — переменные --c-* в main.scss
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        soot: 'rgb(var(--c-soot) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'line-soft': 'rgb(var(--c-line-soft) / <alpha-value>)',
        'line-strong': 'rgb(var(--c-line-strong) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        'ink-2': 'rgb(var(--c-ink-2) / <alpha-value>)',
        'ink-3': 'rgb(var(--c-ink-3) / <alpha-value>)',
        brand: 'rgb(var(--c-brand) / <alpha-value>)',
        'brand-deep': 'rgb(var(--c-brand-deep) / <alpha-value>)',
        'brand-ink': 'rgb(var(--c-brand-ink) / <alpha-value>)',
        wash: 'rgb(var(--c-wash) / <alpha-value>)',

        // тона статусов — только точка и текст, без заливок
        info: 'rgb(var(--c-info) / <alpha-value>)',
        warn: 'rgb(var(--c-warn) / <alpha-value>)',
        way: 'rgb(var(--c-way) / <alpha-value>)',
        ok: 'rgb(var(--c-ok) / <alpha-value>)',
        bad: 'rgb(var(--c-bad) / <alpha-value>)',
      },

      // Радиусы из дизайн-кода: карточки 10, крупные блоки 16, поля 6, пилюли ∞
      borderRadius: {
        card: '10px',
        feature: '16px',
        field: '6px',
      },

      boxShadow: {
        hair: 'var(--sh-hair)',
        card: 'var(--sh-card)',
        pop: 'var(--sh-pop)',
      },

      letterSpacing: {
        display: '-0.021em',
        heading: '-0.025em',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 0.9, 0.3, 1)',
      },
    },
  },
} satisfies Config
