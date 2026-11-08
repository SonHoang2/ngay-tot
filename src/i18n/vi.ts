import { CAN, CHI, NGU_HANH, SAO_28, tenCanChi, THAN, TRUC, type Ngay, type NgayAm, type NoiDungLyDo, type QuanHeHanh } from '../lich'
import type { MucDo } from '../components/dinhdang'

const TEN_VIEC: Record<string, string> = {
  'mua-vang': 'Mua vàng / cầu tài',
  'khai-truong': 'Khai trương',
  'xuat-hanh': 'Xuất hành',
  'ky-hop-dong': 'Ký hợp đồng',
  'cuoi-hoi': 'Cưới hỏi',
  'dong-tho': 'Động thổ / làm nhà',
}

const NAP_AM: Record<QuanHeHanh, string> = {
  'sinh-cho': 'sinh cho mệnh',
  hoa: 'cùng hành với mệnh',
  'duoc-sinh': 'được mệnh sinh (hao)',
  'minh-khac': 'bị mệnh khắc',
  'khac-minh': 'khắc mệnh',
}

const viec = (id: string) => TEN_VIEC[id] ?? id

export const vi = {
  lang: 'vi' as NgonNgu,
  tenNgonNgu: 'Tiếng Việt',
  meta: {
    title: 'Ngày Tốt',
    description: 'Chọn ngày tốt theo tuổi: âm lịch, Can Chi, Hoàng đạo, Thập nhị Trực, xung hợp tuổi.',
  },
  moTa: 'Chọn ngày theo tuổi: âm lịch Việt Nam (UTC+7), Hoàng đạo, Thập nhị Trực, xung hợp tuổi và mệnh.',
  caiDat: {
    ngonNgu: 'Ngôn ngữ',
    giaoDien: 'Giao diện',
    sang: 'Sáng',
    toi: 'Tối',
    heThong: 'Theo máy',
  },
  nhapNgaySinh: 'Nhập ngày sinh để xem các ngày tốt cho tuổi của bạn.',
  tuNgay: 'Từ ngày',
  trongVong: 'Trong vòng',
  soNgay: (n: number) => `${n} ngày`,
  hoangDaoTheo: 'Tính Hoàng đạo theo',
  thangTiet: 'Tháng tiết khí (sách cổ)',
  thangAm: 'Tháng âm lịch',
  ngayTotNhat: (v: string) => `Ngày tốt nhất cho việc ${viec(v).toLowerCase()}`,
  luuY: 'Kết quả chỉ để tham khảo theo phong tục, không phải lời khuyên tài chính hay đầu tư.',
  nguon:
    'Tổng hợp theo quy ước phổ biến của lịch vạn niên Việt Nam (Thập nhị Trực, Hoàng đạo, Nhị thập bát tú, Thọ tử, Sát chủ, xung hợp tuổi, Kim Lâu, Hoang Ốc, Tam tai).',

  form: {
    ngaySinh: 'Ngày sinh (dương lịch)',
    gioiTinh: 'Giới tính',
    nam: 'Nam',
    nu: 'Nữ',
    amLich: 'Âm lịch',
    tuoi: 'Tuổi',
    menh: 'Mệnh',
    tamTai: 'Tam tai',
    xung: 'Xung',
    namTamTai: (chi: number[]) => `Năm ${chi.map((c) => CHI[c]).join(', ')}`,
    ngayXung: (chi: number) => `Ngày ${CHI[chi]}`,
  },

  viecCanLam: 'Việc cần làm',
  tenViec: viec,
  khongCoNgay: 'Không có ngày nào đạt trong khoảng này. Thử mở rộng số ngày.',
  tomTat: (am: string, canChi: string, than: number, truc: number) =>
    `Âm ${am} · ${canChi} · ${THAN[than]} · Trực ${TRUC[truc]}`,

  chiTiet: {
    amLich: (am: string) => `Âm lịch ${am}`,
    ngay: 'Ngày',
    thangNam: 'Tháng / Năm',
    thanTruc: 'Thần trực',
    truc: 'Trực',
    sao28: 'Nhị thập bát tú',
    loaiSao: { kiet: 'Kiết tú', hung: 'Hung tú', binh: 'Bình tú' },
    tietKhi: 'Tiết khí',
    hoangDao: 'Hoàng đạo',
    hacDao: 'Hắc đạo',
    giaoTiet: (ten: string) => `Giao tiết ${ten}`,
    nenTranh: 'Nên tránh:',
    diemTot: 'Điểm tốt',
    diemXau: 'Điểm xấu',
    gioHoangDao: 'Giờ Hoàng đạo',
    khongCo: 'Không có',
  },

  lich: {
    thangTruoc: 'Tháng trước',
    thangSau: 'Tháng sau',
    tieuDe: (m: number, y: number) => `Tháng ${m}/${y}`,
    ngayAmDau: (a: NgayAm) => `${a.ngay}/${a.thang}${a.nhuan ? 'n' : ''}`,
  },

  thu: ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  thuNgan: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  fmtDuong: (n: Ngay) => `${n.d}/${n.m}/${n.y}`,
  fmtAm: (a: NgayAm) => `${a.ngay}/${a.thang}${a.nhuan ? ' nhuận' : ''}/${a.nam}`,

  // Tên riêng của lịch: giữ nguyên tiếng Việt
  canChi: tenCanChi,
  chi: (c: number): string => CHI[c],
  than: (t: number): string => THAN[t],
  truc: (t: number): string => TRUC[t],
  sao28: (s: number): string => SAO_28[s],
  hanh: (h: number): string => NGU_HANH[h],
  tietKhi: (_index: number, ten: string): string => ten,

  mucDo: {
    loai: 'Nên tránh',
    'rat-tot': 'Rất tốt',
    tot: 'Tốt',
    binh: 'Bình thường',
    xau: 'Kém',
  } as Record<MucDo, string>,

  lyDo(l: NoiDungLyDo): string {
    switch (l.ma) {
      case 'thienKhacDiaXung':
        return `Ngày ${CAN[l.canNgay]} ${CHI[l.chiNgay]} thiên khắc địa xung với tuổi`
      case 'xungTuoi':
        return `Ngày ${CHI[l.chiNgay]} xung tuổi ${CHI[l.chiTuoi]}`
      case 'tamNuong':
        return `Tam nương (mùng ${l.ngayAm} âm)`
      case 'nguyetKy':
        return `Nguyệt kỵ (mùng ${l.ngayAm} âm)`
      case 'thoTu':
        return `Ngày ${CHI[l.chiNgay]} là ngày Thọ tử của tháng ${l.thangAm} âm`
      case 'satChu':
        return `Ngày ${CHI[l.chiNgay]} là ngày Sát chủ của tháng ${l.thangAm} âm`
      case 'saoTot':
        return `Sao ${SAO_28[l.sao]} hợp việc ${viec(l.viec).toLowerCase()}`
      case 'saoXau':
        return `Sao ${SAO_28[l.sao]} kỵ việc ${viec(l.viec).toLowerCase()}`
      case 'hoangDao':
        return `Hoàng đạo ${THAN[l.than]}`
      case 'hacDao':
        return `Hắc đạo ${THAN[l.than]}`
      case 'trucTot':
        return `Trực ${TRUC[l.truc]} hợp việc ${viec(l.viec).toLowerCase()}`
      case 'trucXau':
        return `Trực ${TRUC[l.truc]} kỵ việc ${viec(l.viec).toLowerCase()}`
      case 'lucHop':
        return `${CHI[l.chiNgay]} lục hợp với ${CHI[l.chiTuoi]}`
      case 'tamHop':
        return `${CHI[l.chiNgay]} tam hợp với ${CHI[l.chiTuoi]}`
      case 'lucHai':
        return `${CHI[l.chiNgay]} lục hại với ${CHI[l.chiTuoi]}`
      case 'lucPha':
        return `${CHI[l.chiNgay]} lục phá với ${CHI[l.chiTuoi]}`
      case 'tuongHinh':
        return `${CHI[l.chiNgay]} tương hình với ${CHI[l.chiTuoi]}`
      case 'canXung':
        return `Can ${CAN[l.canNgay]} xung can ${CAN[l.canTuoi]}`
      case 'canHop':
        return `Can ${CAN[l.canNgay]} hợp can ${CAN[l.canTuoi]}`
      case 'napAm':
        return `Ngày ${l.napAmNgay.ten} (${NGU_HANH[l.napAmNgay.hanh]}) ${NAP_AM[l.quanHe]} ${l.menh.ten}`
      case 'kimLau':
        return `Năm ${l.nam} tuổi mụ ${l.tuoiMu} phạm ${l.loai}`
      case 'hoangOc':
        return `Năm ${l.nam} tuổi mụ ${l.tuoiMu} phạm Hoang Ốc (${l.cung})`
      case 'tamTai':
        return `Năm ${CHI[l.chiNam]} là năm Tam tai của tuổi`
    }
  },
}

export type TuDien = typeof vi
export type NgonNgu = 'vi' | 'en'
