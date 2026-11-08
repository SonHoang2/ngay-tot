import type { KetQuaNgay, Ngay } from '../lich'

export const toIso = (n: Ngay) =>
  `${n.y}-${String(n.m).padStart(2, '0')}-${String(n.d).padStart(2, '0')}`

export function fromIso(s: string): Ngay | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const n = { y: +m[1], m: +m[2], d: +m[3] }
  return n.y >= 1900 && n.y <= 2199 && n.m >= 1 && n.m <= 12 && n.d >= 1 && n.d <= 31 ? n : null
}

export function homNay(): Ngay {
  const t = new Date()
  return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() }
}

export type MucDo = 'loai' | 'rat-tot' | 'tot' | 'binh' | 'xau'

export function mucDo(k: KetQuaNgay): MucDo {
  if (k.loai) return 'loai'
  if (k.diem >= 4) return 'rat-tot'
  if (k.diem >= 2) return 'tot'
  if (k.diem >= 0) return 'binh'
  return 'xau'
}

export const MAU_MUC_DO: Record<MucDo, string> = {
  loai: 'bg-red-100 text-red-800 ring-red-200 dark:bg-red-950/60 dark:text-red-200 dark:ring-red-900',
  'rat-tot': 'bg-emerald-600 text-white ring-emerald-700 dark:bg-emerald-600 dark:ring-emerald-500',
  tot: 'bg-emerald-100 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-100 dark:ring-emerald-800',
  binh: 'bg-white text-stone-700 ring-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-800',
  xau: 'bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900',
}

export const fmtDiem = (d: number) => (d > 0 ? `+${d}` : `${d}`)
