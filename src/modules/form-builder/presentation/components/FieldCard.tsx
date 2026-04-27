import { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Field } from '../../domain/entities/field.entity'
import { FIELD_TYPES } from '../../domain/entities/field-type'

interface Props {
  field: Field
  position: number
  onRemove: (fieldId: string) => void
  onUpdateLabel: (fieldId: string, label: string) => void
  onUpdateType: (fieldId: string, type: Field['type']) => void
  onUpdateRequired: (fieldId: string, required: boolean) => void
  onUpdateOptions: (fieldId: string, options: string[]) => void
}

export function FieldCard({
  field,
  position,
  onRemove,
  onUpdateLabel,
  onUpdateType,
  onUpdateRequired,
  onUpdateOptions,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(field.label)
  const [newOption, setNewOption] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const optionInputRef = useRef<HTMLInputElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  useEffect(() => {
    if (isEditing) inputRef.current?.select()
  }, [isEditing])

  const confirm = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== field.label) onUpdateLabel(field.id, trimmed)
    else setDraft(field.label)
    setIsEditing(false)
  }

  const cancel = () => {
    setDraft(field.label)
    setIsEditing(false)
  }

  const addOption = () => {
    const trimmed = newOption.trim()
    if (!trimmed || field.options.includes(trimmed)) return
    onUpdateOptions(field.id, [...field.options, trimmed])
    setNewOption('')
    optionInputRef.current?.focus()
  }

  const removeOption = (opt: string) => {
    onUpdateOptions(field.id, field.options.filter((o) => o !== opt))
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-slate-800 border rounded-lg transition-colors ${
        isDragging ? 'border-emerald-500 opacity-50' : 'border-slate-700'
      }`}
    >
      {/* Main row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing transition-colors shrink-0"
            aria-label="Drag to reorder"
          >
            ⠿
          </button>
          <span className="text-xs font-mono w-5 text-center text-slate-500 shrink-0">{position}</span>

          {isEditing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={confirm}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirm()
                if (e.key === 'Escape') cancel()
              }}
              className="bg-slate-700 text-white font-medium rounded px-2 py-0.5 outline-none ring-1 ring-emerald-500 w-full"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="text-white font-medium cursor-text hover:text-emerald-400 transition-colors truncate"
            >
              {field.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          <select
            value={field.type}
            onChange={(e) => onUpdateType(field.id, e.target.value as Field['type'])}
            className="text-xs font-mono px-2 py-1 bg-slate-700 text-emerald-400 rounded border-none outline-none cursor-pointer hover:bg-slate-600 transition-colors"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            onClick={() => onUpdateRequired(field.id, !field.required)}
            className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
              field.required
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Toggle required"
          >
            required
          </button>
          <button
            onClick={() => onRemove(field.id)}
            className="text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Remove field"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Options row — only for select fields */}
      {field.type === 'select' && (
        <div className="px-4 pb-3 pl-14 flex flex-wrap items-center gap-2">
          {field.options.map((opt) => (
            <span
              key={opt}
              className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-700 text-slate-200 rounded-full"
            >
              {opt}
              <button
                onClick={() => removeOption(opt)}
                className="text-slate-400 hover:text-red-400 transition-colors leading-none"
                aria-label={`Remove option ${opt}`}
              >
                ✕
              </button>
            </span>
          ))}
          <input
            ref={optionInputRef}
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addOption()
            }}
            onBlur={addOption}
            placeholder="Add option..."
            className="text-xs bg-transparent text-slate-400 placeholder-slate-600 outline-none w-28 border-b border-slate-600 focus:border-emerald-500 pb-0.5 transition-colors"
          />
        </div>
      )}
    </div>
  )
}
