import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { DANH_SACH_GIAO_DIEN, useGiaoDien, type GiaoDien } from '../giaoDien'
import { DANH_SACH_NGON_NGU, TU_DIEN, useNgonNgu } from '../i18n'

const BIEU_TUONG: Record<GiaoDien, string> = { sang: '☀', toi: '☾', 'he-thong': '◐' }

/** Nút đổi ngôn ngữ và giao diện sáng / tối ở góc trên. */
export function CaiDat() {
  const { ngonNgu, setNgonNgu, t } = useNgonNgu()
  const [giaoDien, setGiaoDien] = useGiaoDien()
  const nhanGiaoDien: Record<GiaoDien, string> = {
    sang: t.caiDat.sang,
    toi: t.caiDat.toi,
    'he-thong': t.caiDat.heThong,
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <NhomNut nhan={t.caiDat.ngonNgu}>
        {DANH_SACH_NGON_NGU.map((n) => (
          <Nut key={n} bat={ngonNgu === n} onClick={() => setNgonNgu(n)} title={TU_DIEN[n].tenNgonNgu} lang={n}>
            {n.toUpperCase()}
          </Nut>
        ))}
      </NhomNut>
      <NhomNut nhan={t.caiDat.giaoDien}>
        {DANH_SACH_GIAO_DIEN.map((g) => (
          <Nut key={g} bat={giaoDien === g} onClick={() => setGiaoDien(g)} title={nhanGiaoDien[g]}>
            <span aria-hidden>{BIEU_TUONG[g]}</span>
            <span className="sr-only">{nhanGiaoDien[g]}</span>
          </Nut>
        ))}
      </NhomNut>
    </div>
  )
}

function NhomNut({ nhan, children }: { nhan: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={nhan} className="flex gap-0.5 rounded-lg bg-stone-200/70 p-0.5 dark:bg-stone-800">
      {children}
    </div>
  )
}

function Nut({
  bat,
  children,
  ...props
}: { bat: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={bat}
      className={`min-w-9 rounded-md px-2 py-1 font-medium transition ${
        bat ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-950 dark:text-stone-100' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}
