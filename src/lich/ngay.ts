/** Tầng 2 – thông tin cố định của một ngày (không phụ thuộc tuổi). */
import { duongSangAm, type NgayAm } from './amlich'
import {
  canChiGio, canChiNam, canChiNgay, canChiThangAm, canChiThangTiet, KHUNG_GIO, napAm,
  type CanChi, type NapAm,
} from './canchi'
import { jdn, muiGio, tietKhi, type Ngay, type TietKhiNgay } from './thienvan'

export const THAN = [
  'Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Bảo Quang',
  'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận',
] as const
const HOANG_DAO = new Set([0, 1, 4, 5, 7, 10])
export const laHoangDao = (than: number) => HOANG_DAO.has(than)

export const TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'] as const
export type TenTruc = (typeof TRUC)[number]

export const TAM_NUONG = new Set([3, 7, 13, 18, 22, 27])
export const NGUYET_KY = new Set([5, 14, 23])

export const SAO_28 = [
  'Giác', 'Cang', 'Đê', 'Phòng', 'Tâm', 'Vĩ', 'Cơ',
  'Đẩu', 'Ngưu', 'Nữ', 'Hư', 'Nguy', 'Thất', 'Bích',
  'Khuê', 'Lâu', 'Vị', 'Mão', 'Tất', 'Chủy', 'Sâm',
  'Tỉnh', 'Quỷ', 'Liễu', 'Tinh', 'Trương', 'Dực', 'Chẩn',
] as const

export type LoaiSao28 = 'kiet' | 'hung' | 'binh'

const SAO_KIET = new Set([3, 5, 6, 7, 12, 13, 15, 16, 18, 25, 27])
const SAO_BINH = new Set([0, 11, 14, 20, 21, 24])

/** Kiết / hung / bình của sao (chỉ số trong SAO_28). */
export const loaiSao28 = (sao: number): LoaiSao28 =>
  SAO_KIET.has(sao) ? 'kiet' : SAO_BINH.has(sao) ? 'binh' : 'hung'

/** Nhị thập bát tú trực ngày: vòng 28 ngày liên tục, mốc 1/1/2000 (JDN 2451545) là sao Vị. */
export const sao28 = (jd: number) => (jd + 11) % 28

/** Chi của ngày Thọ tử theo tháng âm 1..12 (Tuất, Thìn, Hợi, Tỵ, Tý, Ngọ, Sửu, Mùi, Dần, Thân, Mão, Dậu). */
const CHI_THO_TU = [10, 4, 11, 5, 0, 6, 1, 7, 2, 8, 3, 9]
/** Chi của ngày Sát chủ theo tháng âm 1..12 (Tỵ, Tý, Mùi, Mão, Thân, Tuất, Sửu, Hợi, Ngọ, Dậu, Dần, Thìn). */
const CHI_SAT_CHU = [5, 0, 7, 3, 8, 10, 1, 11, 6, 9, 2, 4]

export const laThoTu = (thangAm: number, chiNgay: number) => CHI_THO_TU[thangAm - 1] === chiNgay
export const laSatChu = (thangAm: number, chiNgay: number) => CHI_SAT_CHU[thangAm - 1] === chiNgay

/**
 * Vị thần trực (0..11, xem THAN) theo chi tháng và chi ngày (hoặc chi ngày và chi giờ).
 * "Dần Thân gia Tý, Mão Dậu Dần, Thìn Tuất Thìn, Tỵ Hợi Ngọ, Ngọ Tý Thân, Sửu Mùi Tuất"
 */
export function thanTruc(chiThang: number, chiNgay: number): number {
  const thanhLong = (((chiThang - 2) * 2) % 12 + 12) % 12
  return (chiNgay - thanhLong + 12) % 12
}

/** Thập nhị Trực: ngày có chi trùng chi tháng (theo tiết khí) là trực Kiến. */
export const truc = (chiThangTiet: number, chiNgay: number) => (chiNgay - chiThangTiet + 12) % 12

/** Danh sách chi của các giờ Hoàng đạo trong ngày. */
export const gioHoangDao = (chiNgay: number) =>
  Array.from({ length: 12 }, (_, g) => g).filter((g) => laHoangDao(thanTruc(chiNgay, g)))

export type ThangTheo = 'tiet' | 'am'

export interface TuyChon {
  /** Tháng dùng để tính ngày Hoàng đạo: theo tiết khí (mặc định) hay theo tháng âm lịch. Trực luôn theo tiết khí. */
  hoangDaoTheo?: ThangTheo
}

export interface GioTot {
  chi: number
  canChi: CanChi
  khung: string
  /** Thần trực giờ (0..11, xem THAN). */
  than: number
}

export interface ThongTinNgay {
  duong: Ngay
  jd: number
  thu: number // 0 = Chủ nhật
  am: NgayAm
  canChiNgay: CanChi
  canChiThangAm: CanChi
  canChiThangTiet: CanChi
  canChiNam: CanChi
  napAm: NapAm
  tiet: TietKhiNgay
  than: number
  hoangDao: boolean
  truc: number
  gioTot: GioTot[]
  tamNuong: boolean
  nguyetKy: boolean
  /** Nhị thập bát tú (0..27, xem SAO_28). */
  sao28: number
  thoTu: boolean
  satChu: boolean
}

export function thongTinNgay(duong: Ngay, tuyChon: TuyChon = {}): ThongTinNgay {
  const jd = jdn(duong)
  const tz = muiGio(jd)
  const am = duongSangAm(duong, tz)
  const cc = canChiNgay(jd)
  const tiet = tietKhi(jd, tz)
  // Năm theo tiết khí đổi tại Lập Xuân: tháng Tý/Sửu rơi vào tháng 1–2 dương lịch thuộc năm trước.
  const namTiet = duong.m <= 2 && tiet.chiThang <= 1 ? duong.y - 1 : duong.y
  const ccThangTiet = canChiThangTiet(tiet.chiThang, canChiNam(namTiet).can)
  const ccThangAm = canChiThangAm(am.thang, am.nam)
  const chiThangHD = tuyChon.hoangDaoTheo === 'am' ? ccThangAm.chi : tiet.chiThang
  const than = thanTruc(chiThangHD, cc.chi)
  return {
    duong,
    jd,
    thu: (jd + 1) % 7,
    am,
    canChiNgay: cc,
    canChiThangAm: ccThangAm,
    canChiThangTiet: ccThangTiet,
    canChiNam: canChiNam(am.nam),
    napAm: napAm(cc),
    tiet,
    than,
    hoangDao: laHoangDao(than),
    truc: truc(tiet.chiThang, cc.chi),
    gioTot: gioHoangDao(cc.chi).map((g) => ({
      chi: g,
      canChi: canChiGio(cc.can, g),
      khung: KHUNG_GIO[g],
      than: thanTruc(cc.chi, g),
    })),
    tamNuong: TAM_NUONG.has(am.ngay),
    nguyetKy: NGUYET_KY.has(am.ngay),
    sao28: sao28(jd),
    thoTu: laThoTu(am.thang, cc.chi),
    satChu: laSatChu(am.thang, cc.chi),
  }
}
