import { chamDiemNgay, jdFromDate, jdToDate, thongTinNgay, type GioiTinh, type KetQuaNgay, type ThongTinTuoi, type TuyChon, type Viec } from '../lich'
import { useNgonNgu } from '../i18n'
import { MAU_MUC_DO, mucDo, type MucDo } from './dinhdang'

interface Props {
  thang: { y: number; m: number }
  onThang: (t: { y: number; m: number }) => void
  tuoi: ThongTinTuoi
  viec: Viec
  gioiTinh: GioiTinh
  tuyChon: TuyChon
  chon: number | null
  homNay: number
  onChon: (jd: number) => void
}

export function LichThang({ thang, onThang, tuoi, viec, gioiTinh, tuyChon, chon, homNay, onChon }: Props) {
  const { t } = useNgonNgu()
  const dau = jdFromDate(1, thang.m, thang.y)
  const sau = thang.m === 12 ? { y: thang.y + 1, m: 1 } : { y: thang.y, m: thang.m + 1 }
  const truoc = thang.m === 1 ? { y: thang.y - 1, m: 12 } : { y: thang.y, m: thang.m - 1 }
  const soNgay = jdFromDate(1, sau.m, sau.y) - dau
  const thuDau = (dau + 1) % 7
  const leTrai = (thuDau + 6) % 7 // tuần bắt đầu từ Thứ Hai

  const ngay: KetQuaNgay[] = Array.from({ length: soNgay }, (_, i) =>
    chamDiemNgay(thongTinNgay(jdToDate(dau + i), tuyChon), tuoi, viec, gioiTinh),
  )

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => onThang(truoc)} className="rounded-lg px-3 py-1 hover:bg-stone-100 dark:hover:bg-stone-800" aria-label={t.lich.thangTruoc}>
          ‹
        </button>
        <h2 className="font-semibold">{t.lich.tieuDe(thang.m, thang.y)}</h2>
        <button type="button" onClick={() => onThang(sau)} className="rounded-lg px-3 py-1 hover:bg-stone-100 dark:hover:bg-stone-800" aria-label={t.lich.thangSau}>
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {[1, 2, 3, 4, 5, 6, 0].map((thu) => (
          <div key={thu} className={`py-1 font-medium ${thu === 0 ? 'text-son' : 'text-stone-500'}`}>
            {t.thuNgan[thu]}
          </div>
        ))}
        {Array.from({ length: leTrai }, (_, i) => (
          <div key={`trong-${i}`} />
        ))}
        {ngay.map((k) => {
          const md = mucDo(k)
          const am = k.ngay.am
          return (
            <button
              key={k.ngay.jd}
              type="button"
              onClick={() => onChon(k.ngay.jd)}
              title={t.mucDo[md]}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg ring-1 ${MAU_MUC_DO[md]} ${
                chon === k.ngay.jd ? 'outline-2 outline-offset-1 outline-son' : ''
              }`}
            >
              <span className={`text-sm font-semibold ${k.ngay.jd === homNay ? 'underline decoration-2 underline-offset-2' : ''}`}>
                {k.ngay.duong.d}
              </span>
              <span className="text-[10px] opacity-75">{am.ngay === 1 ? t.lich.ngayAmDau(am) : am.ngay}</span>
            </button>
          )
        })}
      </div>
      <ChuThich />
    </section>
  )
}

function ChuThich() {
  const { t } = useNgonNgu()
  const ds: MucDo[] = ['rat-tot', 'tot', 'binh', 'xau', 'loai']
  return (
    <ul className="mt-3 flex flex-wrap gap-2 text-xs">
      {ds.map((m) => (
        <li key={m} className={`rounded-full px-2 py-0.5 ring-1 ${MAU_MUC_DO[m]}`}>
          {t.mucDo[m]}
        </li>
      ))}
    </ul>
  )
}
