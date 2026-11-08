import { useEffect, useState } from 'react'
import { doc, ghi } from './luuTru'

/** 'he-thong' = theo cài đặt sáng / tối của máy. */
export type GiaoDien = 'sang' | 'toi' | 'he-thong'
export const DANH_SACH_GIAO_DIEN: GiaoDien[] = ['sang', 'toi', 'he-thong']

const truyVanToi = () => window.matchMedia('(prefers-color-scheme: dark)')

function apDung(g: GiaoDien) {
  const toi = g === 'toi' || (g === 'he-thong' && truyVanToi().matches)
  const html = document.documentElement
  html.classList.toggle('dark', toi)
  html.style.colorScheme = toi ? 'dark' : 'light'
}

function giaoDienBanDau(): GiaoDien {
  const v = doc('giaoDien')
  return v === 'sang' || v === 'toi' ? v : 'he-thong'
}

export function useGiaoDien() {
  const [giaoDien, setGiaoDien] = useState<GiaoDien>(giaoDienBanDau)

  useEffect(() => {
    ghi('giaoDien', giaoDien)
    apDung(giaoDien)
    if (giaoDien !== 'he-thong') return
    const mq = truyVanToi()
    const doi = () => apDung('he-thong')
    mq.addEventListener('change', doi)
    return () => mq.removeEventListener('change', doi)
  }, [giaoDien])

  return [giaoDien, setGiaoDien] as const
}
