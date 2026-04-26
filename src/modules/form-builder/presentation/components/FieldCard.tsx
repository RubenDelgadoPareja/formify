import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Field } from '../../domain/entities/field.entity'

interface Props {
  field: Field
  position: number
  onRemove: (fieldId: string) => void
}

export function FieldCard({ field, position, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-4 py-3 bg-slate-800 border rounded-lg transition-colors ${
        isDragging ? 'border-emerald-500 opacity-50' : 'border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
        <span className="text-xs font-mono w-5 text-center text-slate-500">{position}</span>
        <span className="text-white font-medium">{field.label}</span>
      </div>

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
