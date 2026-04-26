import type { Field } from '../../domain/entities/field.entity'

interface Props {
  field: Field
  onRemove: (fieldId: string) => void
}

export function FieldCard({ field, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg">
      <span className="text-white font-medium">{field.label}</span>

      <div className="flex items-center gap-3">
        <span className="text-xs font-mono px-2 py-1 bg-slate-700 text-emerald-400 rounded">
          {field.type}
        </span>
        <button
          onClick={() => onRemove(field.id)}
          className="text-slate-400 hover:text-red-400 transition-colors"
          aria-label="Remove field"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
