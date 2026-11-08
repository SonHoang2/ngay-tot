import { describe, expect, it } from 'vitest'
import {
  amSangDuong, CHI, chamDiemKhoang, cungHoangOc, DANH_SACH_VIEC, duongSangAm, jdFromDate, kimLau,
  namTamTai, tenCanChi, canChiNgay, thongTinNgay, thongTinTuoi, TRUC, xepHang, congNgay, SAO_28, loaiSao28, type Ngay,
} from '..'

const N = (d: number, m: number, y: number): Ngay => ({ d, m, y })
const iso = (n: Ngay) => `${n.y}-${String(n.m).padStart(2, '0')}-${String(n.d).padStart(2, '0')}`

describe('Tầng 1 – âm lịch và Can Chi', () => {
  it('Can Chi ngày 1/1/2000 là Mậu Ngọ', () => {
    expect(tenCanChi(canChiNgay(jdFromDate(1, 1, 2000)))).toBe('Mậu Ngọ')
  })

  it.each([
    [N(9, 11, 2026), { ngay: 1, thang: 10, nam: 2026, nhuan: false }],
    [N(31, 1, 2003), { ngay: 29, thang: 12, nam: 2002, nhuan: false }],
    [N(1, 2, 2003), { ngay: 1, thang: 1, nam: 2003, nhuan: false }],
    [N(9, 11, 2003), { ngay: 16, thang: 10, nam: 2003, nhuan: false }],
    [N(17, 2, 2026), { ngay: 1, thang: 1, nam: 2026, nhuan: false }],
    // Tết theo UTC+7 (khác lịch Trung Quốc)
    [N(21, 1, 1985), { ngay: 1, thang: 1, nam: 1985, nhuan: false }],
    [N(17, 2, 2007), { ngay: 1, thang: 1, nam: 2007, nhuan: false }],
    [N(29, 1, 1968), { ngay: 1, thang: 1, nam: 1968, nhuan: false }],
    // Tháng nhuận
    [N(25, 7, 2025), { ngay: 1, thang: 6, nam: 2025, nhuan: true }],
    [N(22, 3, 2023), { ngay: 1, thang: 2, nam: 2023, nhuan: true }],
  ])('%o → âm lịch', (duong, am) => {
    expect(duongSangAm(duong)).toEqual(am)
    expect(amSangDuong(am)).toEqual(duong)
  })

  it('đổi qua lại âm ⇄ dương khớp với mọi ngày 1990–2040', () => {
    for (let jd = jdFromDate(1, 1, 1990); jd < jdFromDate(1, 1, 2040); jd += 3) {
      const n = congNgay(N(1, 1, 1990), jd - jdFromDate(1, 1, 1990))
      expect(amSangDuong(duongSangAm(n))).toEqual(n)
    }
  })

  it('ngày giao tiết khí 2026', () => {
    expect(thongTinNgay(N(4, 2, 2026)).tiet).toMatchObject({ ten: 'Lập Xuân', batDau: true, chiThang: 2 })
    expect(thongTinNgay(N(7, 11, 2026)).tiet).toMatchObject({ ten: 'Lập Đông', batDau: true, chiThang: 11 })
    expect(thongTinNgay(N(7, 12, 2026)).tiet).toMatchObject({ ten: 'Đại Tuyết', batDau: true, chiThang: 0 })
  })

  it('Can Chi tháng theo tiết khí', () => {
    expect(tenCanChi(thongTinNgay(N(10, 2, 2026)).canChiThangTiet)).toBe('Canh Dần') // năm Bính Ngọ
    expect(tenCanChi(thongTinNgay(N(20, 1, 2026)).canChiThangTiet)).toBe('Kỷ Sửu') // vẫn năm Ất Tỵ
  })
})

describe('Tầng 2 – Hoàng đạo, Trực, tuổi', () => {
  it('trực lặp lại vào ngày giao tiết Đại Tuyết 7/12/2026', () => {
    expect(TRUC[thongTinNgay(N(6, 12, 2026)).truc]).toBe('Bình')
    expect(TRUC[thongTinNgay(N(7, 12, 2026)).truc]).toBe('Bình')
  })

  it('tháng Dần: Hoàng đạo vào các ngày Tý, Sửu, Thìn, Tỵ, Mùi, Tuất', () => {
    const chi = new Set<string>()
    for (let i = 0; i < 24; i++) {
      const t = thongTinNgay(congNgay(N(5, 2, 2026), i)) // trong tháng Dần (Lập Xuân 4/2)
      if (t.hoangDao) chi.add(CHI[t.canChiNgay.chi])
    }
    expect([...chi].sort()).toEqual(['Mùi', 'Sửu', 'Thìn', 'Tuất', 'Tý', 'Tỵ'].sort())
  })

  it('giờ Hoàng đạo ngày Dần: Tý, Sửu, Thìn, Tỵ, Mùi, Tuất', () => {
    const t = thongTinNgay(N(12, 11, 2026)) // Canh Dần
    expect(t.gioTot.map((g) => CHI[g.chi])).toEqual(['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'])
  })

  it('tuổi từ ngày sinh 9/11/2003 là Quý Mùi, mệnh Dương Liễu Mộc', () => {
    const t = thongTinTuoi(N(9, 11, 2003))
    expect(tenCanChi(t.canChi)).toBe('Quý Mùi')
    expect(t.menh.ten).toBe('Dương Liễu Mộc')
    expect(t.tamTai.map((c) => CHI[c])).toEqual(['Tỵ', 'Ngọ', 'Mùi'])
    expect(tenCanChi(thongTinTuoi(N(31, 1, 2003)).canChi)).toBe('Nhâm Ngọ')
  })

  it('Tam tai các nhóm tuổi', () => {
    expect(namTamTai(0).map((c) => CHI[c])).toEqual(['Dần', 'Mão', 'Thìn'])
    expect(namTamTai(2).map((c) => CHI[c])).toEqual(['Thân', 'Dậu', 'Tuất'])
    expect(namTamTai(1).map((c) => CHI[c])).toEqual(['Hợi', 'Tý', 'Sửu'])
  })

  it('Nhị thập bát tú: đối chiếu lịch công khai', () => {
    const sao = (n: Ngay) => SAO_28[thongTinNgay(n).sao28]
    expect(sao(N(1, 1, 2000))).toBe('Vị')
    expect(sao(N(15, 6, 2026))).toBe('Tất')
    expect(sao(N(8, 11, 2026))).toBe('Tinh')
    expect(sao(N(9, 11, 2026))).toBe('Trương')
    expect(sao(N(5, 12, 2026))).toBe('Liễu')
    expect(sao(N(21, 9, 2380))).toBe('Tinh')
  })

  it('Nhị thập bát tú: 11 kiết, 11 hung, 6 bình', () => {
    const ten = (l: string) => SAO_28.filter((_, i) => loaiSao28(i) === l)
    expect(ten('kiet')).toEqual(['Phòng', 'Vĩ', 'Cơ', 'Đẩu', 'Thất', 'Bích', 'Lâu', 'Vị', 'Tất', 'Trương', 'Chẩn'])
    expect(ten('binh')).toEqual(['Giác', 'Nguy', 'Khuê', 'Sâm', 'Tỉnh', 'Tinh'])
    expect(ten('hung')).toEqual(['Cang', 'Đê', 'Tâm', 'Ngưu', 'Nữ', 'Hư', 'Mão', 'Chủy', 'Quỷ', 'Liễu', 'Dực'])
  })

  it('Thọ tử và Sát chủ: đối chiếu lịch công khai', () => {
    const ngayCo = (tu: Ngay, soNgay: number, k: 'thoTu' | 'satChu') =>
      Array.from({ length: soNgay }, (_, i) => thongTinNgay(congNgay(tu, i)))
        .filter((t) => t[k])
        .map((t) => iso(t.duong))
    expect(ngayCo(N(9, 11, 2026), 27, 'thoTu')).toEqual(['2026-11-18', '2026-11-30'])
    expect(ngayCo(N(9, 11, 2026), 27, 'satChu')).toEqual(['2026-11-19', '2026-12-01'])
    expect(thongTinNgay(N(15, 6, 2026)).satChu).toBe(true)
  })

  it('Kim Lâu và Hoang Ốc theo tuổi mụ', () => {
    expect(kimLau(24)).toBe('Kim Lâu Tử') // 24 % 9 = 6
    expect(kimLau(26)).toBe('Kim Lâu Lục Súc') // 26 % 9 = 8
    expect(kimLau(25)).toBeNull()
    expect(cungHoangOc(33)).toEqual({ ten: 'Lục Hoang Ốc', xau: true })
    expect(cungHoangOc(13)).toEqual({ ten: 'Tứ Tấn Tài', xau: false })
    const hoangOc = [12, 14, 15, 18, 21, 23, 24, 27, 29, 30, 32, 33, 36, 38, 39, 41, 42, 45, 47, 48, 50, 51, 54, 56, 57, 60]
    for (let t = 10; t <= 60; t++) expect(cungHoangOc(t).xau).toBe(hoangOc.includes(t))
  })
})

describe('Tầng 3 – chấm điểm cho Quý Mùi mua vàng (8/11 – 31/12/2026)', () => {
  const tuoi = thongTinTuoi(N(9, 11, 2003))
  const viec = DANH_SACH_VIEC.find((v) => v.id === 'mua-vang')!
  const ds = chamDiemKhoang(N(8, 11, 2026), 54, tuoi, viec, 'nam')
  const byIso = new Map(ds.map((k) => [iso(k.ngay.duong), k]))

  it('5 ngày đạt đủ điều kiện như bản Python', () => {
    const sao = ds
      .filter((k) => !k.loai && k.ngay.hoangDao && viec.trucTot.includes(TRUC[k.ngay.truc]))
      .filter((k) => k.xau.every((l) => !['lucHai', 'lucPha', 'tuongHinh'].includes(l.ma)))
      .map((k) => iso(k.ngay.duong))
    expect(sao).toEqual(['2026-11-17', '2026-11-29', '2026-12-12', '2026-12-24', '2026-12-25'])
  })

  it('7/12/2026 đứng đầu nhờ sao Trương, 12/12 tụt vì sao Đê', () => {
    expect(iso(xepHang(ds)[0].ngay.duong)).toBe('2026-12-07')
    expect(byIso.get('2026-12-07')!.diem).toBe(5)
    expect(byIso.get('2026-12-07')!.tot.map((l) => l.ma)).toContain('saoTot')
    expect(byIso.get('2026-12-12')!.diem).toBe(3.5)
    expect(byIso.get('2026-12-12')!.xau.map((l) => l.ma)).toContain('saoXau')
  })

  it('danh sách sao theo việc hợp lệ: đúng tên, không trùng giữa tốt và xấu', () => {
    for (const v of DANH_SACH_VIEC) {
      for (const s of [...v.saoTot, ...v.saoXau]) expect(SAO_28).toContain(s)
      expect(v.saoTot.filter((s) => v.saoXau.includes(s))).toEqual([])
    }
  })

  it('cùng một sao cho điểm khác nhau tùy việc', () => {
    const diemSao = (id: string, n: Ngay) => {
      const v = DANH_SACH_VIEC.find((x) => x.id === id)!
      const k = chamDiemKhoang(n, 1, tuoi, v, 'nam')[0]
      return [...k.tot, ...k.xau].filter((l) => l.ma === 'saoTot' || l.ma === 'saoXau').map((l) => l.diem)
    }
    // 29/11/2026 sao Mão: hung tú nhưng lịch ghi tốt cho xây dựng, kỵ cưới gả
    expect(diemSao('dong-tho', N(29, 11, 2026))).toEqual([1])
    expect(diemSao('cuoi-hoi', N(29, 11, 2026))).toEqual([-1])
    // 18/11/2026 sao Cơ: kiết tú, lịch không nói đến cưới gả
    expect(diemSao('cuoi-hoi', N(18, 11, 2026))).toEqual([])
    expect(diemSao('mua-vang', N(18, 11, 2026))).toEqual([1])
  })

  it('ngày Thọ tử và Sát chủ bị loại', () => {
    expect(byIso.get('2026-11-18')!.loai!.map((l) => l.ma)).toContain('thoTu')
    expect(byIso.get('2026-11-19')!.loai!.map((l) => l.ma)).toContain('satChu')
  })

  it('29/12 Đinh Sửu bị loại vì thiên khắc địa xung', () => {
    expect(byIso.get('2026-12-29')!.loai![0].ma).toBe('thienKhacDiaXung')
    expect(byIso.get('2026-11-11')!.loai).not.toBeNull() // Kỷ Sửu xung + Tam nương
  })
})
