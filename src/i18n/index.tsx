import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { doc, ghi } from '../luuTru'
import { en } from './en'
import { vi, type NgonNgu, type TuDien } from './vi'

export type { NgonNgu, TuDien }

export const TU_DIEN: Record<NgonNgu, TuDien> = { vi, en }
export const DANH_SACH_NGON_NGU: NgonNgu[] = ['vi', 'en']

function ngonNguBanDau(): NgonNgu {
  const daLuu = doc('ngonNgu')
  if (daLuu === 'vi' || daLuu === 'en') return daLuu
  // Lần đầu: theo trình duyệt, mặc định tiếng Việt.
  const trinhDuyet = typeof navigator !== 'undefined' ? navigator.language : 'vi'
  return trinhDuyet.toLowerCase().startsWith('en') ? 'en' : 'vi'
}

interface GiaTri {
  ngonNgu: NgonNgu
  setNgonNgu: (n: NgonNgu) => void
  t: TuDien
}

const NgonNguContext = createContext<GiaTri | null>(null)

export function NgonNguProvider({ children }: { children: ReactNode }) {
  const [ngonNgu, setNgonNgu] = useState<NgonNgu>(ngonNguBanDau)
  const t = TU_DIEN[ngonNgu]

  useEffect(() => {
    ghi('ngonNgu', ngonNgu)
    document.documentElement.lang = ngonNgu
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [ngonNgu, t])

  return <NgonNguContext.Provider value={{ ngonNgu, setNgonNgu, t }}>{children}</NgonNguContext.Provider>
}

export function useNgonNgu(): GiaTri {
  const v = useContext(NgonNguContext)
  if (!v) throw new Error('useNgonNgu phải nằm trong <NgonNguProvider>')
  return v
}
