import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef, useState } from 'react'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { FORM_TEMPLATES } from '../../domain/entities/form-template'
import type { FormTemplate } from '../../domain/entities/form-template'
import { FieldCard } from '../components/FieldCard'
import { FormBuilderViewModel } from '../view-models/form-builder.viewmodel'
import {
  repository,
  codeGeneratorService,
  addFieldUseCase,
  removeFieldUseCase,
  moveFieldUseCase,
  updateFieldUseCase,
} from '../../container'

function EditableTitle({ title, onConfirm }: { title: string; onConfirm: (value: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const confirm = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== title) onConfirm(trimmed)
    else setDraft(title)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(title)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={confirm}
        onKeyDown={(e) => {
          if (e.key === 'Enter') confirm()
          if (e.key === 'Escape') cancel()
        }}
        className="text-xl sm:text-2xl font-bold font-orbitron bg-cyber-800 text-cyber-100 rounded px-2 py-0.5 outline-none ring-2 ring-neon-cyan mb-4 sm:mb-8 w-full"
      />
    )
  }

  return (
    <h1
      onClick={() => setEditing(true)}
      className="text-xl sm:text-2xl font-bold font-orbitron text-cyber-100 mb-4 sm:mb-8 cursor-text hover:text-neon-cyan transition-colors"
      title="Click to edit"
    >
      {title}
    </h1>
  )
}

function TemplatePicker({ onSelect }: { onSelect: (template: FormTemplate) => void }) {
  const [pending, setPending] = useState<FormTemplate | null>(null)

  const confirm = () => {
    if (pending) onSelect(pending)
    setPending(null)
  }

  return (
    <div className="flex items-center gap-2 mb-6 min-h-[28px]">
      <span className="text-[10px] font-orbitron font-semibold text-cyber-400 uppercase tracking-widest shrink-0">
        Templates
      </span>
      {pending ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyber-200">Replace with {pending.name}?</span>
          <button
            onClick={confirm}
            className="px-3 py-1 text-sm font-semibold rounded bg-neon-cyan hover:bg-neon-cyan-dark text-cyber-950 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => setPending(null)}
            className="px-3 py-1 text-sm font-medium rounded border border-cyber-600 bg-cyber-800 hover:border-neon-cyan hover:text-neon-cyan text-cyber-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {FORM_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setPending(template)}
              className="px-3 py-1 text-sm font-medium rounded border border-cyber-600 bg-cyber-800 hover:border-neon-cyan hover:text-neon-cyan text-cyber-200 transition-colors"
            >
              {template.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const FormBuilderPage = observer(() => {
  const vm = useViewModel(
    () =>
      new FormBuilderViewModel(
        repository,
        codeGeneratorService,
        addFieldUseCase,
        removeFieldUseCase,
        moveFieldUseCase,
        updateFieldUseCase,
      ),
  )

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'builder' | 'code'>('builder')

  const highlightedCode = useMemo(
    () => hljs.highlight(vm.generatedCode, { language: 'typescript' }).value,
    [vm.generatedCode],
  )

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !vm.form) return

    const fromIndex = vm.form.fields.findIndex((f) => f.id === active.id)
    const toIndex = vm.form.fields.findIndex((f) => f.id === over.id)

    if (fromIndex !== -1 && toIndex !== -1) {
      void vm.moveField(fromIndex, toIndex)
    }
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(vm.generatedCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!vm.form) return null

  return (
    <div className="min-h-screen bg-cyber-900 cyber-grid flex flex-col">
      {/* Top neon accent bar */}
      <div className="h-0.5 bg-neon-cyan glow-cyan shrink-0" />

      {/* Tab bar — only visible below lg */}
      <div className="lg:hidden sticky top-0 z-10 flex bg-cyber-800 border-b border-cyber-600 shrink-0">
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'builder'
              ? 'text-neon-cyan border-b-2 border-neon-cyan text-glow-cyan'
              : 'text-cyber-400 hover:text-cyber-200'
          }`}
        >
          Builder
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'code'
              ? 'text-neon-cyan border-b-2 border-neon-cyan text-glow-cyan'
              : 'text-cyber-400 hover:text-cyber-200'
          }`}
        >
          Generated Code
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 lg:grid lg:grid-cols-[440px_1fr] lg:gap-6 lg:items-start">
        {/* Left: field builder */}
        <div className={activeTab !== 'builder' ? 'hidden lg:block' : ''}>
          <EditableTitle
            key={vm.form.title}
            title={vm.form.title}
            onConfirm={(title) => { void vm.updateFormTitle(title) }}
          />

          <TemplatePicker onSelect={(template) => { void vm.loadTemplate(template) }} />

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={vm.form.fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3 mb-6">
                {vm.form.fields.map((field, index) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    position={index + 1}
                    onRemove={(id) => { void vm.removeField(id) }}
                    onUpdateLabel={(id, label) => { void vm.updateFieldLabel(id, label) }}
                    onUpdateType={(id, type) => { void vm.updateFieldType(id, type) }}
                    onUpdateRequired={(id, required) => { void vm.updateFieldRequired(id, required) }}
                    onUpdateOptions={(id, options) => { void vm.updateFieldOptions(id, options) }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button
            onClick={() => { void vm.addField() }}
            className="flex items-center gap-2 px-4 py-2 bg-neon-cyan hover:bg-neon-cyan-dark text-cyber-950 font-semibold rounded-lg transition-all glow-cyan-sm hover:glow-cyan"
          >
            <span>+</span>
            <span>Add field</span>
          </button>
        </div>

        {/* Right: code preview */}
        <div
          className={`${activeTab !== 'code' ? 'hidden lg:flex' : 'flex'} flex-col bg-cyber-800 rounded-xl border border-cyber-600 p-4 sm:p-5 mt-6 lg:mt-0 min-h-[60vh] lg:min-h-0 lg:sticky lg:top-6`}
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <span className="text-[10px] font-orbitron font-semibold text-cyber-400 uppercase tracking-widest">
              Generated Code
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm font-medium rounded border border-cyber-600 bg-cyber-750 hover:border-neon-cyan hover:text-neon-cyan text-cyber-200 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="flex-1 overflow-auto text-sm font-jetbrains leading-relaxed bg-cyber-950 rounded-lg p-4 border border-cyber-600">
            <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
        </div>
      </div>
    </div>
  )
})

export default FormBuilderPage
