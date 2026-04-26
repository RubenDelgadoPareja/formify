import { observer } from 'mobx-react-lite'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { FieldCard } from '../components/FieldCard'
import { FormBuilderViewModel } from '../view-models/form-builder.viewmodel'
import { repository, addFieldUseCase } from '../../container'

const FormBuilderPage = observer(() => {
  const vm = useViewModel(() => new FormBuilderViewModel(repository, addFieldUseCase))

  if (!vm.form) return null

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-8">{vm.form.title}</h1>

        <div className="flex flex-col gap-3 mb-6">
          {vm.form.fields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>

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
