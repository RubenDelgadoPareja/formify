import type { Field } from '../../domain/entities/field.entity'

interface Props {
  field: Field
}

export function FieldCard({ field }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg">
      <span className="text-white font-medium">{field.label}</span>
      <span className="text-xs font-mono px-2 py-1 bg-slate-700 text-emerald-400 rounded">
        {field.type}
      </span>
    </div>
  )
}
