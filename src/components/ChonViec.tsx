import { useNgonNgu } from '../i18n'
import { DANH_SACH_VIEC } from '../lich'

export function ChonViec({ viecId, onChon }: { viecId: string; onChon: (id: string) => void }) {
  const { t } = useNgonNgu()
  return (
    <div role="radiogroup" aria-label={t.viecCanLam} className="flex flex-wrap gap-2">
      {DANH_SACH_VIEC.map((v) => (
        <button
          key={v.id}
          type="button"
          role="radio"
          aria-checked={viecId === v.id}
          onClick={() => onChon(v.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
            viecId === v.id
              ? 'bg-son text-white ring-son'
              : 'bg-white ring-stone-200 hover:ring-son/50 dark:bg-stone-900 dark:ring-stone-800'
          }`}
        >
          {t.tenViec(v.id)}
        </button>
      ))}
    </div>
  )
}
