/** Đổi dương lịch ⇄ âm lịch Việt Nam (thuật toán Hồ Ngọc Đức). */
import { getNewMoonDay, getSunLongitudeSeg, jdFromDate, jdToDate, muiGio, type Ngay } from './thienvan'

const INT = Math.floor

export interface NgayAm {
  ngay: number
  thang: number
  nam: number
  nhuan: boolean
}

/** Ngày bắt đầu tháng 11 âm lịch (tháng chứa Đông Chí) của năm yy. */
function getLunarMonth11(yy: number, tz: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021
  const k = INT(off / 29.530588853)
  let nm = getNewMoonDay(k, tz)
  if (getSunLongitudeSeg(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz)
  return nm
}

/** Vị trí tháng nhuận tính từ tháng 11 (năm có 13 tháng). */
function getLeapMonthOffset(a11: number, tz: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5)
  let last: number
  let i = 1
  let arc = getSunLongitudeSeg(getNewMoonDay(k + i, tz), tz)
  do {
    last = arc
    i++
    arc = getSunLongitudeSeg(getNewMoonDay(k + i, tz), tz)
  } while (arc !== last && i < 14)
  return i - 1
}

export function duongSangAm(n: Ngay, tz?: number): NgayAm {
  const dayNumber = jdFromDate(n.d, n.m, n.y)
  const z = tz ?? muiGio(dayNumber)
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853)
  let monthStart = getNewMoonDay(k + 1, z)
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, z)
  let a11 = getLunarMonth11(n.y, z)
  let b11 = a11
  let lunarYear: number
  if (a11 >= monthStart) {
    lunarYear = n.y
    a11 = getLunarMonth11(n.y - 1, z)
  } else {
    lunarYear = n.y + 1
    b11 = getLunarMonth11(n.y + 1, z)
  }
  const lunarDay = dayNumber - monthStart + 1
  const diff = INT((monthStart - a11) / 29)
  let lunarLeap = false
  let lunarMonth = diff + 11
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, z)
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10
      if (diff === leapMonthDiff) lunarLeap = true
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1
  return { ngay: lunarDay, thang: lunarMonth, nam: lunarYear, nhuan: lunarLeap }
}

/** Đổi âm lịch sang dương lịch. Trả về null nếu tháng nhuận không tồn tại. */
export function amSangDuong(am: NgayAm, tz?: number): Ngay | null {
  const z = tz ?? muiGio(jdFromDate(1, 1, am.nam))
  let a11: number, b11: number
  if (am.thang < 11) {
    a11 = getLunarMonth11(am.nam - 1, z)
    b11 = getLunarMonth11(am.nam, z)
  } else {
    a11 = getLunarMonth11(am.nam, z)
    b11 = getLunarMonth11(am.nam + 1, z)
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853)
  let off = am.thang - 11
  if (off < 0) off += 12
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, z)
    let leapMonth = leapOff - 2
    if (leapMonth < 0) leapMonth += 12
    if (am.nhuan && am.thang !== leapMonth) return null
    if (am.nhuan || off >= leapOff) off += 1
  } else if (am.nhuan) {
    return null
  }
  const monthStart = getNewMoonDay(k + off, z)
  return jdToDate(monthStart + am.ngay - 1)
}
