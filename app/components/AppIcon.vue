<script setup lang="ts">
  /* Иконки — Lucide (ISC): единая сетка 24, одинаковая толщина штриха,
     ровные окончания. Свои SVG-пути не рисуем: у набора уже выдержана
     оптика, а нам нужен предсказуемый, «неавторский» инструментальный вид.

     Компонент оставлен обёрткой, чтобы разделы обращались к иконке по
     смыслу («поставка»), а не по имени глифа — набор можно заменить в
     одном месте. */
  import {
    ArrowRight,
    Bell,
    Building2,
    Check,
    CheckCheck,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    CircleCheck,
    Clock,
    Download,
    ExternalLink,
    FileCheck2,
    FileText,
    Files,
    HandCoins,
    LayoutGrid,
    LogOut,
    Menu,
    MessageSquareText,
    Moon,
    Package,
    Paperclip,
    Phone,
    Plus,
    ReceiptText,
    Search,
    SendHorizontal,
    Settings,
    Sun,
    TriangleAlert,
    Truck,
    User,
    X,
  } from '@lucide/vue'

  const ICONS = {
    grid: LayoutGrid,
    doc: FileText,
    box: Package,
    folder: Files,
    chat: MessageSquareText,
    search: Search,
    bell: Bell,
    moon: Moon,
    sun: Sun,
    user: User,
    company: Building2,
    phone: Phone,
    send: SendHorizontal,
    clip: Paperclip,
    check: Check,
    'check-double': CheckCheck,
    'check-circle': CircleCheck,
    'file-check': FileCheck2,
    clock: Clock,
    alert: TriangleAlert,
    info: CircleAlert,
    truck: Truck,
    invoice: ReceiptText,
    pay: HandCoins,
    down: ChevronDown,
    right: ChevronRight,
    left: ChevronLeft,
    'arrow-right': ArrowRight,
    close: X,
    menu: Menu,
    plus: Plus,
    logout: LogOut,
    settings: Settings,
    download: Download,
    external: ExternalLink,
  } as const

  type IconName = keyof typeof ICONS

  const props = withDefaults(defineProps<{ name: IconName | string; stroke?: number }>(), {
    stroke: 1.6,
  })

  const icon = computed(() => ICONS[props.name as IconName] ?? FileText)
</script>

<template>
  <component :is="icon" :stroke-width="stroke" aria-hidden="true" />
</template>
