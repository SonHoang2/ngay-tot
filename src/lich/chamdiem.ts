/** Tầng 3 – chấm điểm ngày theo tuổi và việc. Quy tắc nằm trong quytac/viec.json. */
import { quanHeHanh, type NapAm, type QuanHeHanh } from './canchi'
import { thongTinNgay, TRUC, type ThongTinNgay, type TuyChon } from './ngay'
import { jdn, jdToDate, type Ngay } from './thienvan'
import {
  canHop, canXung, cungHoangOc, kimLau, lucHai, lucHop, lucPha, lucXung, tamHop, tuoiMu, tuongHinh,
  type GioiTinh, type ThongTinTuoi,
} from './tuoi'
import quyTac from './quytac/viec.json'

export type XetNam = 'kimLau' | 'kimLauNu' | 'hoangOc' | 'tamTai'

export interface Viec {
  id: string
  ten: string
  trucTot: string[]
  trucXau: string[]
  xetNam: XetNam[]
}

export const DANH_SACH_VIEC = quyTac.viec as Viec[]
export const NGUON_QUY_TAC = quyTac.nguon

/**
 * Lý do cộng / trừ điểm hoặc loại ngày, ở dạng mã + tham số (chỉ số Can, Chi, Thần, Trực…).
 * Giao diện tự diễn đạt thành câu theo ngôn ngữ đang chọn (xem src/i18n).
 */
export type NoiDungLyDo =
  | { ma: 'thienKhacDiaXung'; canNgay: number; chiNgay: number }
  | { ma: 'xungTuoi'; chiNgay: number; chiTuoi: number }
  | { ma: 'tamNuong' | 'nguyetKy'; ngayAm: number }
  | { ma: 'hoangDao' | 'hacDao'; than: number }
  | { ma: 'trucTot' | 'trucXau'; truc: number; viec: string }
  | { ma: 'lucHop' | 'tamHop' | 'lucHai' | 'lucPha' | 'tuongHinh'; chiNgay: number; chiTuoi: number }
  | { ma: 'canXung' | 'canHop'; canNgay: number; canTuoi: number }
  | { ma: 'napAm'; quanHe: QuanHeHanh; napAmNgay: NapAm; menh: NapAm }
  | { ma: 'kimLau'; nam: number; tuoiMu: number; loai: string }
  | { ma: 'hoangOc'; nam: number; tuoiMu: number; cung: string }
  | { ma: 'tamTai'; chiNam: number }

export type MaLyDo = NoiDungLyDo['ma']

export type LyDo = NoiDungLyDo & { diem: number }

export interface KetQuaNgay {
  ngay: ThongTinNgay
  diem: number
  tot: LyDo[]
  xau: LyDo[]
  /** Lý do loại ngày (phạm điều cấm nặng), null nếu không bị loại. */
  loai: NoiDungLyDo[] | null
}

const D = quyTac.diem
const L = quyTac.loaiNgay

export function chamDiemNgay(
  ngay: ThongTinNgay,
  tuoi: ThongTinTuoi,
  viec: Viec,
  gioiTinh: GioiTinh,
): KetQuaNgay {
  const tot: LyDo[] = []
  const xau: LyDo[] = []
  const loai: NoiDungLyDo[] = []
  const them = (diem: number, noiDung: NoiDungLyDo) => {
    if (diem > 0) tot.push({ ...noiDung, diem })
    else if (diem < 0) xau.push({ ...noiDung, diem })
  }

  const { can: canN, chi: chiN } = ngay.canChiNgay
  const { can: canT, chi: chiT } = tuoi.canChi
  const chi = { chiNgay: chiN, chiTuoi: chiT }
  const can = { canNgay: canN, canTuoi: canT }

  // --- Điều cấm nặng: loại ngày ---
  const xung = lucXung(chiN, chiT)
  const thienKhac = xung && canXung(canN, canT)
  if (thienKhac && L.thienKhacDiaXung) loai.push({ ma: 'thienKhacDiaXung', canNgay: canN, chiNgay: chiN })
  else if (xung && L.xungTuoi) loai.push({ ma: 'xungTuoi', ...chi })
  if (ngay.tamNuong && L.tamNuong) loai.push({ ma: 'tamNuong', ngayAm: ngay.am.ngay })
  if (ngay.nguyetKy && L.nguyetKy) loai.push({ ma: 'nguyetKy', ngayAm: ngay.am.ngay })

  // --- Hoàng đạo / Hắc đạo ---
  if (ngay.hoangDao) them(D.hoangDao, { ma: 'hoangDao', than: ngay.than })
  else them(D.hacDao, { ma: 'hacDao', than: ngay.than })

  // --- Trực ---
  const tenTruc = TRUC[ngay.truc]
  if (viec.trucTot.includes(tenTruc)) them(D.trucTot, { ma: 'trucTot', truc: ngay.truc, viec: viec.id })
  else if (viec.trucXau.includes(tenTruc)) them(D.trucXau, { ma: 'trucXau', truc: ngay.truc, viec: viec.id })

  // --- Quan hệ địa chi ---
  if (lucHop(chiN, chiT)) them(D.lucHop, { ma: 'lucHop', ...chi })
  if (tamHop(chiN, chiT)) them(D.tamHop, { ma: 'tamHop', ...chi })
  if (lucHai(chiN, chiT)) them(D.lucHai, { ma: 'lucHai', ...chi })
  if (lucPha(chiN, chiT)) them(D.lucPha, { ma: 'lucPha', ...chi })
  if (tuongHinh(chiN, chiT)) them(D.tuongHinh, { ma: 'tuongHinh', ...chi })

  // --- Thiên can ---
  if (!thienKhac && canXung(canN, canT)) them(D.canXung, { ma: 'canXung', ...can })
  if (canHop(canN, canT)) them(D.canHop, { ma: 'canHop', ...can })

  // --- Nạp âm ---
  const qh = quanHeHanh(ngay.napAm.hanh, tuoi.menh.hanh)
  them(D.napAm[qh], { ma: 'napAm', quanHe: qh, napAmNgay: ngay.napAm, menh: tuoi.menh })

  // --- Hạn theo năm (tính theo năm âm của ngày xem) ---
  const tm = tuoiMu(tuoi.am.nam, ngay.am.nam)
  const nam = ngay.am.nam
  for (const x of viec.xetNam) {
    if (x === 'kimLau' || x === 'kimLauNu') {
      const kl = kimLau(tm)
      if (!kl) continue
      if (x === 'kimLauNu' && gioiTinh !== 'nu') continue
      them(D.kimLau, { ma: 'kimLau', nam, tuoiMu: tm, loai: kl })
    } else if (x === 'hoangOc') {
      const ho = cungHoangOc(tm)
      if (ho.xau) them(D.hoangOc, { ma: 'hoangOc', nam, tuoiMu: tm, cung: ho.ten })
    } else if (x === 'tamTai') {
      if (tuoi.tamTai.includes(ngay.canChiNam.chi)) them(D.tamTai, { ma: 'tamTai', chiNam: ngay.canChiNam.chi })
    }
  }

  const diem = [...tot, ...xau].reduce((s, l) => s + l.diem, 0)
  return { ngay, diem, tot, xau, loai: loai.length ? loai : null }
}

export function congNgay(n: Ngay, soNgay: number): Ngay {
  return jdToDate(jdn(n) + soNgay)
}

/** Chấm điểm `soNgay` ngày liên tiếp kể từ `tuNgay`, giữ nguyên thứ tự ngày. */
export function chamDiemKhoang(
  tuNgay: Ngay,
  soNgay: number,
  tuoi: ThongTinTuoi,
  viec: Viec,
  gioiTinh: GioiTinh,
  tuyChon: TuyChon = {},
): KetQuaNgay[] {
  return Array.from({ length: soNgay }, (_, i) =>
    chamDiemNgay(thongTinNgay(congNgay(tuNgay, i), tuyChon), tuoi, viec, gioiTinh),
  )
}

/** Xếp hạng: ngày không bị loại trước, điểm cao trước, cùng điểm thì ngày sớm trước. */
export function xepHang(ds: KetQuaNgay[]): KetQuaNgay[] {
  return [...ds].sort(
    (a, b) => Number(!!a.loai) - Number(!!b.loai) || b.diem - a.diem || a.ngay.jd - b.ngay.jd,
  )
}
