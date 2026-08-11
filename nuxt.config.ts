// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // Кабинет за логином: SEO не нужен, зато нужны localStorage-тема и много
  // клиентского состояния (фильтры, раскрытия, чат). SPA — честнее и проще.
  ssr: false,

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Система Снабжения — клиентский портал',
      script: [
        {
          // Тема ставится до первого paint, иначе белая вспышка на тёмной.
          innerHTML:
            "try{document.documentElement.dataset.theme=localStorage.getItem('snab-theme')||'light'}catch(e){}",
          tagPriority: 'critical',
          tagPosition: 'head',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#fafaf9' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          // Inter — интерфейс, Inter Tight — заголовки (замена Roobert из дизайн-кода)
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500&display=swap',
        },
      ],
    },
  },

  /* Кабинет — SPA: статике нужен только шелл (index/200/404), маршруты
     разбирает роутер на клиенте. Обход ссылок выключен, чтобы сборка не
     плодила лишние копии одного и того же шелла по всем разделам. */
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [process.env.NUXT_APP_BASE_URL || '/'],
    },
  },

  devtools: { enabled: false },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  tailwindcss: { cssPath: '~/assets/css/main.scss' },
})
