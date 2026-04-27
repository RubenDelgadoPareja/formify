import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { observer } from 'mobx-react-lite'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { FieldCard } from '../components/FieldCard'
import { FormBuilderViewModel } from '../view-models/form-builder.viewmodel'
import { useState } from 'react'
import {
  repository,
  codeGeneratorService,
  addFieldUseCase,
  removeFieldUseCase,
  moveFieldUseCase,
  updateFieldUseCase,
} from '../../container'

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
    <div className="min-h-screen bg-slate-900 p-6 grid grid-cols-[440px_1fr] gap-6">
      {/* Left: field builder */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-8">{vm.form.title}</h1>

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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={() => { void vm.addField() }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
        >
          <span>+</span>
          <span>Add field</span>
        </button>
      </div>

      {/* Right: code preview */}
      <div className="bg-slate-800 rounded-xl p-5 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Generated code
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm font-medium rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="flex-1 overflow-auto text-sm text-slate-100 font-mono leading-relaxed">
          <code>{vm.generatedCode}</code>
        </pre>
      </div>
    </div>
  )
})

export default FormBuilderPage
