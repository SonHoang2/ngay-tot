/** Tầng 2 – thông tin theo tuổi người dùng và quan hệ xung / hợp. */
import { duongSangAm, type NgayAm } from './amlich'
import { canChiNam, CHI, napAm, type CanChi, type NapAm } from './canchi'
import type { Ngay } from './thienvan'

export type GioiTinh = 'nam' | 'nu'

export interface ThongTinTuoi {
  ngaySinh: Ngay
  am: NgayAm
  canChi: CanChi
  menh: NapAm
  /** Chi của 3 năm Tam tai. */
  tamTai: number[]
}

export function thongTinTuoi(ngaySinh: Ngay): ThongTinTuoi {
  const am = duongSangAm(ngaySinh)
  const canChi = canChiNam(am.nam)
  return { ngaySinh, am, canChi, menh: napAm(canChi), tamTai: namTamTai(canChi.chi) }
}

// ---------- Địa chi ----------
export const lucXung = (a: number, b: number) => (a - b + 12) % 12 === 6
export const lucHop = (a: number, b: number) => (a + b) % 12 === 1
export const tamHop = (a: number, b: number) => a !== b && a % 4 === b % 4
export const lucHai = (a: number, b: number) => (a + b) % 12 === 7

const PHA: Record<number, number> = { 0: 9, 9: 0, 6: 3, 3: 6, 8: 5, 5: 8, 2: 11, 11: 2, 4: 1, 1: 4, 10: 7, 7: 10 }
export const lucPha = (a: number, b: number) => PHA[a] === b

// Dần–Tỵ–Thân, Sửu–Tuất–Mùi, Tý–Mão; tự hình: Thìn, Ngọ, Dậu, Hợi
const HINH: Record<number, number[]> = {
  0: [3], 3: [0],
  2: [5, 8], 5: [2, 8], 8: [2, 5],
  1: [10, 7], 10: [1, 7], 7: [1, 10],
  4: [4], 6: [6], 9: [9], 11: [11],
}
export const tuongHinh = (a: number, b: number) => HINH[a].includes(b)

// ---------- Thiên can ----------
/** Giáp–Canh, Ất–Tân, Bính–Nhâm, Đinh–Quý. Mậu, Kỷ không xung. */
export const canXung = (a: number, b: number) => Math.abs(a - b) === 6
/** Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý. */
export const canHop = (a: number, b: number) => Math.abs(a - b) === 5

// ---------- Hạn theo năm ----------
/** Tam tai: Thân Tý Thìn → Dần Mão Thìn; Hợi Mão Mùi → Tỵ Ngọ Mùi; Dần Ngọ Tuất → Thân Dậu Tuất; Tỵ Dậu Sửu → Hợi Tý Sửu. */
export function namTamTai(chiTuoi: number): number[] {
  const batDau = (2 + 3 * ((4 - (chiTuoi % 4)) % 4)) % 12
  return [batDau, (batDau + 1) % 12, (batDau + 2) % 12]
}
export const tenNamTamTai = (chiTuoi: number) => namTamTai(chiTuoi).map((c) => CHI[c]).join(', ')

/** Tuổi mụ: năm âm cần xem − năm âm sinh + 1. */
export const tuoiMu = (namAmSinh: number, namAmXem: number) => namAmXem - namAmSinh + 1

const KIM_LAU: Record<number, string> = { 1: 'Kim Lâu Thân', 3: 'Kim Lâu Thê', 6: 'Kim Lâu Tử', 8: 'Kim Lâu Lục Súc' }
/** Trả về tên loại Kim Lâu nếu phạm, ngược lại null. */
export const kimLau = (tuoi: number): string | null => KIM_LAU[tuoi % 9] ?? null

export const CUNG_HOANG_OC = ['Nhất Cát', 'Nhì Nghi', 'Tam Địa Sát', 'Tứ Tấn Tài', 'Ngũ Thọ Tử', 'Lục Hoang Ốc'] as const
/** Cung Hoang Ốc theo tuổi mụ (10 tuổi khởi Nhất Cát, mỗi chục tiến 1 cung, rồi đếm tiếp hàng đơn vị). */
export function cungHoangOc(tuoi: number): { ten: string; xau: boolean } {
  const i = (((Math.floor(tuoi / 10) - 1 + (tuoi % 10)) % 6) + 6) % 6
  return { ten: CUNG_HOANG_OC[i], xau: i === 2 || i === 4 || i === 5 }
}
