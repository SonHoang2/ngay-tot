/** Can Chi năm / tháng / ngày / giờ và Nạp âm 60 hoa giáp. */

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const

/** Khung giờ của 12 chi (giờ Tý từ 23h hôm trước tới 1h). */
export const KHUNG_GIO = CHI.map((_, i) => {
  const bd = (i * 2 + 23) % 24
  return `${bd}h–${(bd + 2) % 24}h`
})

export interface CanChi {
  can: number // 0..9
  chi: number // 0..11
}

export const tenCanChi = (c: CanChi) => `${CAN[c.can]} ${CHI[c.chi]}`

export const canChiNgay = (jd: number): CanChi => ({ can: (jd + 9) % 10, chi: (jd + 1) % 12 })

export const canChiNam = (namAm: number): CanChi => ({
  can: (((namAm + 6) % 10) + 10) % 10,
  chi: (((namAm + 8) % 12) + 12) % 12,
})

/** Can Chi tháng theo tháng âm lịch (tháng Giêng = Dần). Tháng nhuận dùng Can Chi của tháng chính. */
export const canChiThangAm = (thang: number, namAm: number): CanChi => ({
  can: (namAm * 12 + thang + 3) % 10,
  chi: (thang + 1) % 12,
})

/**
 * Can Chi tháng theo tiết khí.
 * canNamTiet: Can của năm tính theo Lập Xuân (không theo Tết).
 * Năm Giáp/Kỷ → tháng Dần là Bính Dần; Ất/Canh → Mậu Dần; Bính/Tân → Canh Dần; Đinh/Nhâm → Nhâm Dần; Mậu/Quý → Giáp Dần.
 */
export function canChiThangTiet(chiThang: number, canNamTiet: number): CanChi {
  const canThangDan = ((canNamTiet % 5) * 2 + 2) % 10
  return { can: (canThangDan + ((chiThang - 2 + 12) % 12)) % 10, chi: chiThang }
}

/** Can Chi của một giờ (chi giờ 0..11) trong ngày có Can ngày canNgay. */
export function canChiGio(canNgay: number, chiGio: number): CanChi {
  return { can: ((canNgay % 5) * 2 + chiGio) % 10, chi: chiGio }
}

/** Chỉ số 0..59 trong vòng hoa giáp (Giáp Tý = 0). */
export const lucThapHoaGiap = (c: CanChi) => (((6 * c.can - 5 * c.chi) % 60) + 60) % 60

// Ngũ hành theo vòng tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc
export const NGU_HANH = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'] as const
export type HanhIndex = 0 | 1 | 2 | 3 | 4
const [MOC, HOA, THO, KIM, THUY] = [0, 1, 2, 3, 4] as const

const NAP_AM: [string, HanhIndex][] = [
  ['Hải Trung Kim', KIM], ['Lư Trung Hỏa', HOA], ['Đại Lâm Mộc', MOC], ['Lộ Bàng Thổ', THO],
  ['Kiếm Phong Kim', KIM], ['Sơn Đầu Hỏa', HOA], ['Giản Hạ Thủy', THUY], ['Thành Đầu Thổ', THO],
  ['Bạch Lạp Kim', KIM], ['Dương Liễu Mộc', MOC], ['Tuyền Trung Thủy', THUY], ['Ốc Thượng Thổ', THO],
  ['Tích Lịch Hỏa', HOA], ['Tùng Bách Mộc', MOC], ['Trường Lưu Thủy', THUY], ['Sa Trung Kim', KIM],
  ['Sơn Hạ Hỏa', HOA], ['Bình Địa Mộc', MOC], ['Bích Thượng Thổ', THO], ['Kim Bạch Kim', KIM],
  ['Phú Đăng Hỏa', HOA], ['Thiên Hà Thủy', THUY], ['Đại Trạch Thổ', THO], ['Thoa Xuyến Kim', KIM],
  ['Tang Đố Mộc', MOC], ['Đại Khê Thủy', THUY], ['Sa Trung Thổ', THO], ['Thiên Thượng Hỏa', HOA],
  ['Thạch Lựu Mộc', MOC], ['Đại Hải Thủy', THUY],
]

export interface NapAm {
  ten: string
  hanh: HanhIndex
}

export function napAm(c: CanChi): NapAm {
  const [ten, hanh] = NAP_AM[Math.floor(lucThapHoaGiap(c) / 2)]
  return { ten, hanh }
}

export type QuanHeHanh = 'sinh-cho' | 'hoa' | 'duoc-sinh' | 'khac-minh' | 'minh-khac'

/**
 * Quan hệ của hành `ngay` đối với hành `menh`:
 * - 'sinh-cho': ngày sinh cho mệnh (tốt)  - 'hoa': cùng hành
 * - 'duoc-sinh': mệnh sinh cho ngày (hao)  - 'khac-minh': ngày khắc mệnh (xấu)
 * - 'minh-khac': mệnh khắc ngày
 */
export function quanHeHanh(ngay: HanhIndex, menh: HanhIndex): QuanHeHanh {
  if (ngay === menh) return 'hoa'
  if ((ngay + 1) % 5 === menh) return 'sinh-cho'
  if ((menh + 1) % 5 === ngay) return 'duoc-sinh'
  if ((ngay + 2) % 5 === menh) return 'khac-minh'
  return 'minh-khac'
}
