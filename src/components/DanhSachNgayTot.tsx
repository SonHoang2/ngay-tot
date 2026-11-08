import { useNgonNgu } from '../i18n'
import type { KetQuaNgay } from '../lich'
import { fmtDiem, MAU_MUC_DO, mucDo } from './dinhdang'

interface Props {
  ds: KetQuaNgay[]
  chon: number | null
  onChon: (jd: number) => void
}

export function DanhSachNgayTot({ ds, chon, onChon }: Props) {
  const { t } = useNgonNgu()
  if (!ds.length) return <p className="text-sm text-stone-500">{t.khongCoNgay}</p>
  return (
    <ol className="flex flex-col gap-2">
      {ds.map((k, i) => {
        const md = mucDo(k)
        return (
          <li key={k.ngay.jd}>
            <button
              type="button"
              onClick={() => onChon(k.ngay.jd)}
              className={`flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left ring-1 transition hover:ring-2 hover:ring-son/40 dark:bg-stone-900 ${
                chon === k.ngay.jd ? 'ring-2 ring-son' : 'ring-stone-200 dark:ring-stone-800'
              }`}
            >
              <span className="w-6 shrink-0 text-center text-sm font-semibold text-stone-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">
                  {t.thu[k.ngay.thu]}, {t.fmtDuong(k.ngay.duong)}
                </span>
                <span className="block truncate text-xs text-stone-500">
                  {t.tomTat(t.fmtAm(k.ngay.am), t.canChi(k.ngay.canChiNgay), k.ngay.than, k.ngay.truc)}
                </span>
              </span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${MAU_MUC_DO[md]}`}>
                {t.mucDo[md]} {fmtDiem(k.diem)}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
