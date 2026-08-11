type Theme = 'light' | 'dark'

const KEY = 'snab-theme'

/** Тема живёт в data-theme на <html>; в head есть анти-мигание, читающее тот же ключ. */
export const useTheme = () => {
  const theme = useState<Theme>('theme', () => 'light')

  const apply = (v: Theme) => {
    const root = document.documentElement

    /* На время переключения глушим переходы. Иначе каждый из тысяч
       элементов с transition-colors анимирует смену цвета одновременно,
       и тема «переползает» вместо мгновенного переключения. */
    root.classList.add('theme-swap')
    root.dataset.theme = v
    theme.value = v

    // таймер, а не rAF: в фоновой вкладке кадров нет и класс завис бы навсегда
    setTimeout(() => root.classList.remove('theme-swap'), 60)

    try {
      localStorage.setItem(KEY, v)
    } catch {
      // приватный режим — просто не запоминаем
    }
  }

  const init = () => {
    theme.value = (document.documentElement.dataset.theme as Theme) || 'light'
  }

  const toggle = () => apply(theme.value === 'dark' ? 'light' : 'dark')

  return { theme, init, toggle }
}
