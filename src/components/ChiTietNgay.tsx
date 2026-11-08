import type { KetQuaNgay, LyDo } from '../lich'
import { useNgonNgu } from '../i18n'
import { fmtDiem, MAU_MUC_DO, mucDo } from './dinhdang'

export function ChiTietNgay({ k }: { k: KetQuaNgay }) {
  const { t } = useNgonNgu()
  const c = t.chiTiet
  const n = k.ngay
  const md = mucDo(k)
  const tiet = t.tietKhi(n.tiet.index, n.tiet.ten)
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {t.thu[n.thu]}, {t.fmtDuong(n.duong)}
          </h2>
          <p className="text-sm text-stone-500">{c.amLich(t.fmtAm(n.am))}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${MAU_MUC_DO[md]}`}>
          {t.mucDo[md]} {fmtDiem(k.diem)}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <O nhan={c.ngay} giaTri={`${t.canChi(n.canChiNgay)} · ${n.napAm.ten} (${t.hanh(n.napAm.hanh)})`} />
        <O nhan={c.thangNam} giaTri={`${t.canChi(n.canChiThangTiet)} / ${t.canChi(n.canChiNam)}`} />
        <O nhan={c.thanTruc} giaTri={`${t.than(n.than)} · ${n.hoangDao ? c.hoangDao : c.hacDao}`} />
        <O nhan={c.truc} giaTri={t.truc(n.truc)} />
        <O nhan={c.tietKhi} giaTri={n.tiet.batDau ? c.giaoTiet(tiet) : tiet} />
      </dl>

      {k.loai && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          <p className="font-semibold">{c.nenTranh}</p>
          <ul className="list-disc pl-5">
            {k.loai.map((l) => (
              <li key={l.ma}>{t.lyDo(l)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <DsLyDo tieuDe={c.diemTot} ds={k.tot} mau="text-emerald-700 dark:text-emerald-400" />
        <DsLyDo tieuDe={c.diemXau} ds={k.xau} mau="text-amber-700 dark:text-amber-400" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">{c.gioHoangDao}</h3>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {n.gioTot.map((g) => (
          <li key={g.chi} className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800">
            <span className="font-medium">{t.chi(g.chi)}</span> <span className="text-stone-500">{g.khung}</span>
            <span className="block text-xs text-stone-500">{t.than(g.than)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function O({ nhan, giaTri }: { nhan: string; giaTri: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-500">{nhan}</dt>
      <dd className="font-medium">{giaTri}</dd>
    </div>
  )
}

function DsLyDo({ tieuDe, ds, mau }: { tieuDe: string; ds: LyDo[]; mau: string }) {
  const { t } = useNgonNgu()
  return (
    <div>
      <h3 className={`text-sm font-semibold ${mau}`}>{tieuDe}</h3>
      {ds.length ? (
        <ul className="mt-1 flex flex-col gap-1 text-sm">
          {ds.map((l) => (
            <li key={l.ma} className="flex justify-between gap-2">
              <span>{t.lyDo(l)}</span>
              <span className={`shrink-0 tabular-nums ${mau}`}>{fmtDiem(l.diem)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-stone-500">{t.chiTiet.khongCo}</p>
      )}
    </div>
  )
}
