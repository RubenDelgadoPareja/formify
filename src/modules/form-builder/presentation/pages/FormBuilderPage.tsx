import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { observer } from 'mobx-react-lite'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { FieldCard } from '../components/FieldCard'
import { FormBuilderViewModel } from '../view-models/form-builder.viewmodel'
import {
  repository,
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
        addFieldUseCase,
        removeFieldUseCase,
        moveFieldUseCase,
        updateFieldUseCase,
      ),
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

  if (!vm.form) return null

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="mx-auto max-w-2xl">
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
    </div>
  )
})

export default FormBuilderPage
