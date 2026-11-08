/**
 * Tầng 1 – toán thiên văn.
 * Port thuật toán của Hồ Ngọc Đức (https://www.informatik.uni-leipzig.de/~duc/amlich/),
 * dựa trên "Astronomical Algorithms" của Jean Meeus.
 */

/** Ngày dương lịch (không dùng Date để tránh lỗi múi giờ của trình duyệt). */
export interface Ngay {
  y: number
  m: number // 1..12
  d: number // 1..31
}

const INT = Math.floor
const DR = Math.PI / 180

/** Số ngày Julius (JDN) của một ngày dương lịch – ứng với 12h trưa UT ngày đó. */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12)
  const y = yy + 4800 - a
  const m = mm + 12 * a - 3
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083
  }
  return jd
}

export function jdToDate(jd: number): Ngay {
  let b: number, c: number
  if (jd > 2299160) {
    const a = jd + 32044
    b = INT((4 * a + 3) / 146097)
    c = a - INT((b * 146097) / 4)
  } else {
    b = 0
    c = jd + 32082
  }
  const d = INT((4 * c + 3) / 1461)
  const e = c - INT((1461 * d) / 4)
  const m = INT((5 * e + 2) / 153)
  return {
    d: e - INT((153 * m + 2) / 5) + 1,
    m: m + 3 - 12 * INT(m / 10),
    y: b * 100 + d - 4800 + INT(m / 10),
  }
}

export const jdn = (n: Ngay) => jdFromDate(n.d, n.m, n.y)

/**
 * Múi giờ dùng cho lịch Việt Nam: UTC+7 từ năm 1968,
 * trước đó lịch miền Bắc tính theo UTC+8 (giờ Bắc Kinh).
 */
const JD_1968 = jdFromDate(1, 1, 1968)
export function muiGio(jd: number): number {
  return jd < JD_1968 ? 8 : 7
}

/** Thời điểm Sóc (trăng mới) thứ k tính từ 1/1/1900, trả về JD (UT, số thực). */
export function newMoon(k: number): number {
  const T = k / 1236.85
  const T2 = T * T
  const T3 = T2 * T
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DR)
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * DR) + 0.0021 * Math.sin(2 * DR * M)
  C1 = C1 - 0.4068 * Math.sin(Mpr * DR) + 0.0161 * Math.sin(DR * 2 * Mpr)
  C1 = C1 - 0.0004 * Math.sin(DR * 3 * Mpr)
  C1 = C1 + 0.0104 * Math.sin(DR * 2 * F) - 0.0051 * Math.sin(DR * (M + Mpr))
  C1 = C1 - 0.0074 * Math.sin(DR * (M - Mpr)) + 0.0004 * Math.sin(DR * (2 * F + M))
  C1 = C1 - 0.0004 * Math.sin(DR * (2 * F - M)) - 0.0006 * Math.sin(DR * (2 * F + Mpr))
  C1 = C1 + 0.001 * Math.sin(DR * (2 * F - Mpr)) + 0.0005 * Math.sin(DR * (2 * Mpr + M))
  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2
  return Jd1 + C1 - deltat
}

/** Kinh độ biểu kiến của Mặt Trời (độ, 0..360) tại thời điểm jd (UT, số thực). */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const T2 = T * T
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(DR * M)
  DL += (0.019993 - 0.000101 * T) * Math.sin(DR * 2 * M) + 0.00029 * Math.sin(DR * 3 * M)
  const omega = 125.04 - 1934.136 * T
  const L = L0 + DL - 0.00569 - 0.00478 * Math.sin(omega * DR)
  return ((L % 360) + 360) % 360
}

/** Ngày (JDN, giờ địa phương) chứa điểm Sóc thứ k. */
export function getNewMoonDay(k: number, tz: number): number {
  return INT(newMoon(k) + 0.5 + tz / 24)
}

/** Cung 30° (0..11) của Mặt Trời lúc 0h giờ địa phương ngày dayNumber. 0 = Xuân Phân. */
export function getSunLongitudeSeg(dayNumber: number, tz: number): number {
  return INT(sunLongitude(dayNumber - 0.5 - tz / 24) / 30)
}

export const TEN_TIET_KHI = [
  'Xuân Phân', 'Thanh Minh', 'Cốc Vũ', 'Lập Hạ', 'Tiểu Mãn', 'Mang Chủng',
  'Hạ Chí', 'Tiểu Thử', 'Đại Thử', 'Lập Thu', 'Xử Thử', 'Bạch Lộ',
  'Thu Phân', 'Hàn Lộ', 'Sương Giáng', 'Lập Đông', 'Tiểu Tuyết', 'Đại Tuyết',
  'Đông Chí', 'Tiểu Hàn', 'Đại Hàn', 'Lập Xuân', 'Vũ Thủy', 'Kinh Trập',
] as const

export interface TietKhiNgay {
  /** Chỉ số 0..23 của tiết khí đang hiệu lực (tính đến cuối ngày). */
  index: number
  ten: string
  /** true nếu thời điểm giao tiết rơi vào chính ngày này. */
  batDau: boolean
  /** Chi của tháng theo tiết khí (0 = Tý … 11 = Hợi). Ngày giao tiết tính sang tháng mới. */
  chiThang: number
}

export function tietKhi(jd: number, tz: number = muiGio(jd)): TietKhiNgay {
  const cuoiNgay = sunLongitude(jd + 0.5 - tz / 24)
  const dauNgay = sunLongitude(jd - 0.5 - tz / 24)
  const index = INT(cuoiNgay / 15)
  return {
    index,
    ten: TEN_TIET_KHI[index],
    batDau: INT(dauNgay / 15) !== index,
    // Tháng Dần bắt đầu từ Lập Xuân (315°), mỗi tháng 30°.
    chiThang: (INT((((cuoiNgay - 315) % 360) + 360) % 360 / 30) + 2) % 12,
  }
}
