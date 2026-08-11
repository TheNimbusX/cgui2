import type { KpDetail, Manager } from '../types'

/** Клиент, под которым открыт кабинет */
export const PROFILE = {
  name: 'Малых Кирилл Александрович',
  short: 'К. Малых',
  initials: 'КМ',
  company: 'АО «Аэропорт Кольцово»',
  inn: '7701234567',
  kpp: '770101001',
  address: 'Россия, г. Екатеринбург, аэропорт Кольцово',
  contract: 'Д-2025-001',
  contractAt: '2026-01-15',
}

export const MANAGERS: Record<string, Manager> = {
  kuznetsova: {
    name: 'Ольга Кузнецова',
    role: 'Менеджер по снабжению',
    phone: '8 800 500-21-04',
    email: 'o.kuznetsova@snabsystem.ru',
  },
  petrova: {
    name: 'Анна Петрова',
    role: 'Менеджер по снабжению',
    phone: '8 800 500-21-07',
    email: 'a.petrova@snabsystem.ru',
  },
  ivanov: {
    name: 'Сергей Иванов',
    role: 'Ведущий менеджер',
    phone: '8 800 500-21-12',
    email: 's.ivanov@snabsystem.ru',
  },
}

export const MANAGER_LIST = [MANAGERS.kuznetsova!, MANAGERS.petrova!, MANAGERS.ivanov!]

/** Номенклатура — то, что реально возит компания */
export const PRODUCTS: { item: string; brand: string }[] = [
  { item: 'Промышленный ПК CP2215-1004-000', brand: 'Beckhoff' },
  { item: 'Насос R 2.9, 600 bar', brand: 'Hawe Hydraulik' },
  { item: 'Частотный преобразователь FR-A840', brand: 'Mitsubishi' },
  { item: 'Пневмоцилиндр DSBC-50-200', brand: 'Festo' },
  { item: 'Серводвигатель 1FK7060', brand: 'Siemens' },
  { item: 'Гидрораспределитель 4WE6', brand: 'Bosch Rexroth' },
  { item: 'Датчик давления PN2094', brand: 'IFM' },
  { item: 'Контроллер S7-1200', brand: 'Siemens' },
  { item: 'Мотор-редуктор NMRV-063', brand: 'Motovario' },
  { item: 'Реле безопасности PNOZ s4', brand: 'Pilz' },
  { item: 'Энкодер RVK58N', brand: 'Pepperl+Fuchs' },
  { item: 'Клапан VUVG-L14', brand: 'Festo' },
]

/** Суммы КП, ₽ */
export const AMOUNTS = [216_000, 432_000, 540_000, 720_000, 300_000, 480_000, 1_080_000, 1_200_000]

export const LEAD_TIMES = [
  '2–3 недели',
  '3–4 недели',
  '4–6 недель',
  '5–7 недель',
  '6–8 недель',
  '8–10 недель',
  '10–12 недель',
]

/* ============================================================
   Состав КП-2025-015 — 18 позиций SEW Eurodrive.
   Это «живой» пример из реального КП: по нему считаются итоги
   в карточке КП и в раскрытии строки на главной.
   ============================================================ */
export const SEW_KP: KpDetail = {
  currency: 'EUR',
  rate: 88.06,
  total: 17_429.99,
  totalRub: 1_534_884.9,
  leadTime: '8–11 недель',
  lines: [
    { name: 'Мотор-редуктор SEW Eurodrive FA47B CD90L-4/II2G', sku: 'FA47B CD90L-4/II2G', qty: 2, price: 562.35 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive R37 CD80K-4/II2GD', sku: 'R37 CD80K-4/II2GD', qty: 1, price: 436.2 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive R77A/II2GD', sku: 'R77A/II2GD', qty: 1, price: 693.9 }, // prettier-ignore
    { name: 'Диск тормозной SEW Eurodrive BM31 300 Nm 230 AC', sku: 'BM31 300Nm 230AC', qty: 4, price: 1243.49 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive SAF47DT80K4/BMG', sku: 'SAF47DT80K4/BMG', qty: 1, price: 1061.74 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive R17DT71D4/BMG', sku: 'R17DT71D4/BMG', qty: 1, price: 658.49 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive KAF47 DT80K4 BMG M1B', sku: 'KAF47 DT80K4 BMG M1B', qty: 1, price: 1435.46 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive SA47 DT80K4/TF M3A', sku: 'SA47 DT80K4/TF M3A', qty: 1, price: 462.44 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive SA47 DT80N4 M1A 270', sku: 'SA47 DT80N4 M1A 270', qty: 1, price: 448.13 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive SAF47 DT80N4 M3B', sku: 'SAF47 DT80N4 M3B', qty: 1, price: 484.77 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive R27 DT80N4 M1', sku: 'R27 DT80N4 M1', qty: 1, price: 421.06 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive SA47 DT80N4 M1', sku: 'SA47 DT80N4 M1', qty: 1, price: 439.62 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive SA57 DT90S4 M1', sku: 'SA57 DT90S4 M1', qty: 1, price: 524.18 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive SA57 DT90L4 BMG M4', sku: 'SA57 DT90L4 BMG M4', qty: 1, price: 639.44 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive RF17 DT71D4', sku: 'RF17DT71D4', qty: 1, price: 372.85 }, // prettier-ignore
    { name: 'Тормоз SEW Eurodrive BE30', sku: 'BE30', qty: 2, price: 1239.08 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive R67 CD90L2-8/4/II2GD', sku: 'R67 CD90L2-8/4/II2GD', qty: 1, price: 401.29 }, // prettier-ignore
    { name: 'Мотор-редуктор SEW Eurodrive R67A/II2GD', sku: 'R67A/II2GD', qty: 1, price: 373.6 }, // prettier-ignore
  ],
}
