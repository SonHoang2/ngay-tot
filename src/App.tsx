import { useEffect, useMemo, useState } from 'react'
import {
  chamDiemKhoang, chamDiemNgay, DANH_SACH_VIEC, jdn, jdToDate, thongTinNgay, thongTinTuoi,
  xepHang, type GioiTinh, type ThangTheo, type TuyChon,
} from './lich'
import { CaiDat } from './components/CaiDat'
import { ChiTietNgay } from './components/ChiTietNgay'
import { ChonViec } from './components/ChonViec'
import { DanhSachNgayTot } from './components/DanhSachNgayTot'
import { FormNgaySinh } from './components/FormNgaySinh'
import { LichThang } from './components/LichThang'
import { fromIso, homNay, toIso } from './components/dinhdang'
import { useNgonNgu } from './i18n'
import { doc, ghi } from './luuTru'

const SO_NGAY = [30, 60, 90, 180]

export default function App() {
  const { t } = useNgonNgu()
  const hn = useMemo(homNay, [])
  const [ngaySinh, setNgaySinh] = useState(() => doc('ngaySinh') ?? '')
  const [gioiTinh, setGioiTinh] = useState<GioiTinh>(() => (doc('gioiTinh') === 'nu' ? 'nu' : 'nam'))
  const [viecId, setViecId] = useState(DANH_SACH_VIEC[0].id)
  const [tuNgay, setTuNgay] = useState(toIso(hn))
  const [soNgay, setSoNgay] = useState(60)
  const [hoangDaoTheo, setHoangDaoTheo] = useState<ThangTheo>('tiet')
  const [chon, setChon] = useState<number | null>(null)
  // null = tự theo tháng của ngày đang chọn
  const [thang, setThang] = useState<{ y: number; m: number } | null>(null)

  useEffect(() => ghi('ngaySinh', ngaySinh), [ngaySinh])
  useEffect(() => ghi('gioiTinh', gioiTinh), [gioiTinh])

  const sinh = fromIso(ngaySinh)
  const tuoi = useMemo(() => (sinh ? thongTinTuoi(sinh) : null), [ngaySinh])
  const viec = DANH_SACH_VIEC.find((v) => v.id === viecId)!
  const tuyChon: TuyChon = useMemo(() => ({ hoangDaoTheo }), [hoangDaoTheo])
  const batDau = fromIso(tuNgay) ?? hn

  const ketQua = useMemo(
    () => (tuoi ? chamDiemKhoang(batDau, soNgay, tuoi, viec, gioiTinh, tuyChon) : []),
    [tuoi, tuNgay, soNgay, viec, gioiTinh, tuyChon],
  )
  const top = useMemo(() => xepHang(ketQua).filter((k) => !k.loai && k.diem > 0).slice(0, 10), [ketQua])

  const ngayChon = chon ?? top[0]?.ngay.jd ?? null
  const chiTiet =
    tuoi && ngayChon !== null
      ? chamDiemNgay(thongTinNgay(jdToDate(ngayChon), tuyChon), tuoi, viec, gioiTinh)
      : null

  const chonNgay = (jd: number) => {
    setChon(jd)
    setThang(null)
  }
  const thangChon = ngayChon !== null ? jdToDate(ngayChon) : hn
  const thangHienThi = thang ?? { y: thangChon.y, m: thangChon.m }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-6 sm:py-10">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            <span className="text-son">Ngày</span> Tốt
          </h1>
          <p className="mt-1 text-sm text-stone-500">{t.moTa}</p>
        </div>
        <CaiDat />
      </header>

      <FormNgaySinh
        ngaySinh={ngaySinh}
        gioiTinh={gioiTinh}
        tuoi={tuoi}
        onNgaySinh={setNgaySinh}
        onGioiTinh={setGioiTinh}
      />

      {!tuoi ? (
        <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-stone-500 dark:border-stone-700">
          {t.nhapNgaySinh}
        </p>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <ChonViec
              viecId={viecId}
              onChon={(id) => {
                setViecId(id)
                setChon(null)
              }}
            />
            <div className="flex flex-wrap items-end gap-4 text-sm">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-stone-500">{t.tuNgay}</span>
                <input
                  type="date"
                  value={tuNgay}
                  onChange={(e) => {
                    setTuNgay(e.target.value)
                    setChon(null)
                  }}
                  className="rounded-lg border border-stone-300 bg-transparent px-3 py-1.5 dark:border-stone-700"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-stone-500">{t.trongVong}</span>
                <select
                  value={soNgay}
                  onChange={(e) => {
                    setSoNgay(+e.target.value)
                    setChon(null)
                  }}
                  className="rounded-lg border border-stone-300 bg-transparent px-3 py-1.5 dark:border-stone-700"
                >
                  {SO_NGAY.map((s) => (
                    <option key={s} value={s}>
                      {t.soNgay(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-stone-500">{t.hoangDaoTheo}</span>
                <select
                  value={hoangDaoTheo}
                  onChange={(e) => setHoangDaoTheo(e.target.value as ThangTheo)}
                  className="rounded-lg border border-stone-300 bg-transparent px-3 py-1.5 dark:border-stone-700"
                >
                  <option value="tiet">{t.thangTiet}</option>
                  <option value="am">{t.thangAm}</option>
                </select>
              </label>
            </div>
          </section>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="flex min-w-0 flex-col gap-3">
              <h2 className="font-semibold">{t.ngayTotNhat(viec.id)}</h2>
              <DanhSachNgayTot ds={top} chon={ngayChon} onChon={chonNgay} />
            </div>
            <div className="flex min-w-0 flex-col gap-5">
              {chiTiet && <ChiTietNgay k={chiTiet} />}
              <LichThang
                thang={thangHienThi}
                onThang={setThang}
                tuoi={tuoi}
                viec={viec}
                gioiTinh={gioiTinh}
                tuyChon={tuyChon}
                chon={ngayChon}
                homNay={jdn(hn)}
                onChon={chonNgay}
              />
            </div>
          </div>
        </>
      )}

      <footer className="border-t border-stone-200 pt-4 text-xs text-stone-500 dark:border-stone-800">
        <p>{t.luuY}</p>
        <p className="mt-1">{t.nguon}</p>
      </footer>
    </div>
  )
}
