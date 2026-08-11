import { REQUESTS } from '~/utils/data/requests'

/* Разделы кабинета. В шапке и в нижнем таб-баре один и тот же список —
   чтобы навигация не разъезжалась между десктопом и телефоном.
   В бейдже — только то, что требует внимания: общие счётчики в меню шумят. */
export const useNav = () => {
  const { unreadChats, overdue } = usePortal()
  const route = useRoute()

  /* Главная активна только на самой себе, остальные разделы — вместе со
     своими вложенными страницами (карточка КП оставляет активным «КП»). */
  const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

  const items = computed(() => [
    {
      to: '/',
      label: 'Главная',
      icon: 'grid',
      badge: REQUESTS.filter((r) => r.unread).length,
    },
    {
      to: '/kp',
      label: 'КП',
      icon: 'doc',
      badge: REQUESTS.filter((r) => r.stage === 'kp').length,
    },
    {
      to: '/orders',
      label: 'Заказы',
      icon: 'box',
      badge: REQUESTS.filter((r) => r.stage === 'payment').length + overdue.value.length,
    },
    { to: '/docs', label: 'Документы', icon: 'folder', badge: 0 },
    { to: '/chat', label: 'Чат', icon: 'chat', badge: unreadChats.value },
  ])

  return { items, isActive }
}
