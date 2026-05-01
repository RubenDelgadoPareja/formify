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
      className={`bg-cyber-800 border rounded-lg transition-all ${
        isDragging
          ? 'border-neon-cyan glow-cyan-sm opacity-50'
          : 'border-cyber-600 hover:border-cyber-500'
      }`}
    >
      {/* Main row */}
      <div className="flex items-start justify-between px-3 sm:px-4 py-3 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="text-cyber-500 hover:text-neon-cyan cursor-grab active:cursor-grabbing transition-colors shrink-0 mt-0.5"
            aria-label="Drag to reorder"
          >
            ⠿
          </button>
          <span className="text-xs font-jetbrains w-5 text-center text-cyber-500 shrink-0">
            {position}
          </span>

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
              className="bg-cyber-750 text-cyber-100 font-medium rounded px-2 py-0.5 outline-none ring-1 ring-neon-cyan w-full"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="text-cyber-100 font-medium cursor-text hover:text-neon-cyan transition-colors truncate"
            >
              {field.label}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
          <select
            value={field.type}
            onChange={(e) => onUpdateType(field.id, e.target.value as Field['type'])}
            className="text-xs font-jetbrains px-2 py-1 bg-cyber-700 text-neon-cyan rounded border border-cyber-600 outline-none cursor-pointer hover:border-neon-cyan transition-colors"
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
                ? 'bg-neon-cyan text-cyber-950 font-semibold'
                : 'bg-cyber-700 text-cyber-400 hover:text-cyber-200 border border-cyber-600'
            }`}
            aria-label="Toggle required"
          >
            req
          </button>
          <button
            onClick={() => onRemove(field.id)}
            className="text-cyber-400 hover:text-neon-pink transition-colors"
            aria-label="Remove field"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Options row — only for select fields */}
      {field.type === 'select' && (
        <div className="px-3 sm:px-4 pb-3 pl-11 sm:pl-14 flex flex-wrap items-center gap-2 border-t border-cyber-700 pt-2">
          {field.options.map((opt) => (
            <span
              key={opt}
              className="flex items-center gap-1 text-xs px-2 py-1 bg-cyber-750 text-cyber-200 rounded-full border border-cyber-600"
            >
              {opt}
              <button
                onClick={() => removeOption(opt)}
                className="text-cyber-500 hover:text-neon-pink transition-colors leading-none"
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
            className="text-xs font-jetbrains bg-transparent text-cyber-300 placeholder-cyber-500 outline-none w-28 border-b border-cyber-600 focus:border-neon-cyan pb-0.5 transition-colors"
          />
        </div>
      )}
    </div>
  )
}
