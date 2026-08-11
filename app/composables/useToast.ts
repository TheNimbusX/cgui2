/** Одиночный тост: в кабинете больше одного сообщения за раз не нужно. */
export const useToast = () => {
  const message = useState<string>('toast', () => '')
  let timer: ReturnType<typeof setTimeout> | undefined

  const toast = (text: string) => {
    message.value = text
    clearTimeout(timer)
    timer = setTimeout(() => (message.value = ''), 3200)
  }

  return { message, toast }
}
