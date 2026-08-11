/* Фильтр по этапу живёт в адресе: ссылку на «счета к оплате» можно
   переслать коллеге, а кнопка «назад» возвращает прежнюю выборку. */
export const useStageFilter = () => {
  const route = useRoute()
  const router = useRouter()

  const chip = ref<string>((route.query.stage as string) || 'all')

  watch(
    () => route.query.stage,
    (v) => (chip.value = (v as string) || 'all'),
  )

  watch(chip, (v) => {
    const query = { ...route.query }
    if (v === 'all') delete query.stage
    else query.stage = v
    router.replace({ query })
  })

  return chip
}
