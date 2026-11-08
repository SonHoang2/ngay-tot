import { useNgonNgu } from '../i18n'
import type { GioiTinh, ThongTinTuoi } from '../lich'

interface Props {
  ngaySinh: string
  gioiTinh: GioiTinh
  tuoi: ThongTinTuoi | null
  onNgaySinh: (v: string) => void
  onGioiTinh: (v: GioiTinh) => void
}

export function FormNgaySinh({ ngaySinh, gioiTinh, tuoi, onNgaySinh, onGioiTinh }: Props) {
  const { t } = useNgonNgu()
  const f = t.form
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{f.ngaySinh}</span>
          <input
            type="date"
            value={ngaySinh}
            min="1900-01-01"
            max="2199-12-31"
            onChange={(e) => onNgaySinh(e.target.value)}
            className="rounded-lg border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700"
          />
        </label>
        <fieldset className="flex flex-col gap-1 text-sm">
          <legend className="mb-1 font-medium">{f.gioiTinh}</legend>
          <div className="flex gap-1 rounded-lg bg-stone-100 p-1 dark:bg-stone-800">
            {(['nam', 'nu'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGioiTinh(g)}
                aria-pressed={gioiTinh === g}
                className={`rounded-md px-4 py-1.5 ${
                  gioiTinh === g ? 'bg-white shadow-sm dark:bg-stone-950' : 'text-stone-500'
                }`}
              >
                {g === 'nam' ? f.nam : f.nu}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {tuoi && (
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Muc nhan={f.amLich} giaTri={t.fmtAm(tuoi.am)} />
          <Muc nhan={f.tuoi} giaTri={t.canChi(tuoi.canChi)} noiBat />
          <Muc nhan={f.menh} giaTri={`${tuoi.menh.ten} (${t.hanh(tuoi.menh.hanh)})`} />
          <Muc nhan={f.tamTai} giaTri={f.namTamTai(tuoi.tamTai)} />
          <Muc nhan={f.xung} giaTri={f.ngayXung((tuoi.canChi.chi + 6) % 12)} />
        </dl>
      )}
    </section>
  )
}

function Muc({ nhan, giaTri, noiBat }: { nhan: string; giaTri: string; noiBat?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-stone-500">{nhan}</dt>
      <dd className={noiBat ? 'text-lg font-semibold text-son' : 'font-medium'}>{giaTri}</dd>
    </div>
  )
}
