import { computed, makeObservable, observable, runInAction } from 'mobx'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.viewmodel'
import { Field } from '../../domain/entities/field.entity'
import { Form } from '../../domain/entities/form.entity'
import type { FormRepository } from '../../domain/repositories/form.repository'
import type { CodeGeneratorService } from '../../domain/services/code-generator.service'
import type { AddFieldUseCase } from '../../domain/use-cases/add-field.use-case'
import type { MoveFieldUseCase } from '../../domain/use-cases/move-field.use-case'
import type { RemoveFieldUseCase } from '../../domain/use-cases/remove-field.use-case'
import type { UpdateFieldUseCase } from '../../domain/use-cases/update-field.use-case'

const DEFAULT_FORM_ID = 'default-form'

export class FormBuilderViewModel extends BaseViewModel {
  form: Form | null = null

  private readonly repository: FormRepository
  private readonly codeGenerator: CodeGeneratorService
  private readonly addFieldUseCase: AddFieldUseCase
  private readonly removeFieldUseCase: RemoveFieldUseCase
  private readonly moveFieldUseCase: MoveFieldUseCase
  private readonly updateFieldUseCase: UpdateFieldUseCase

  constructor(
    repository: FormRepository,
    codeGenerator: CodeGeneratorService,
    addFieldUseCase: AddFieldUseCase,
    removeFieldUseCase: RemoveFieldUseCase,
    moveFieldUseCase: MoveFieldUseCase,
    updateFieldUseCase: UpdateFieldUseCase,
  ) {
    super()
    this.repository = repository
    this.codeGenerator = codeGenerator
    this.addFieldUseCase = addFieldUseCase
    this.removeFieldUseCase = removeFieldUseCase
    this.moveFieldUseCase = moveFieldUseCase
    this.updateFieldUseCase = updateFieldUseCase
    makeObservable(this, { form: observable, generatedCode: computed })
  }

  get generatedCode(): string {
    return this.form ? this.codeGenerator.generate(this.form) : ''
  }

  async didMount(): Promise<void> {
    let form = await this.repository.findById(DEFAULT_FORM_ID)
    if (!form) {
      form = new Form({ id: DEFAULT_FORM_ID, title: 'My Form' })
      await this.repository.save(form)
    }
    runInAction(() => {
      this.form = form
    })
  }

  async addField(): Promise<void> {
    if (!this.form) return
    const field = new Field({
      id: crypto.randomUUID(),
      type: 'text',
      label: `Field ${this.form.fields.length + 1}`,
    })
    const updated = await this.addFieldUseCase.execute({ formId: this.form.id, field })
    runInAction(() => {
      this.form = updated
    })
  }

  async removeField(fieldId: string): Promise<void> {
    if (!this.form) return
    const updated = await this.removeFieldUseCase.execute({ formId: this.form.id, fieldId })
    runInAction(() => {
      this.form = updated
    })
  }

  async moveField(fromIndex: number, toIndex: number): Promise<void> {
    if (!this.form) return
    const updated = await this.moveFieldUseCase.execute({ formId: this.form.id, fromIndex, toIndex })
    runInAction(() => {
      this.form = updated
    })
  }

  async updateFieldLabel(fieldId: string, label: string): Promise<void> {
    if (!this.form) return
    const field = this.form.fields.find((f) => f.id === fieldId)
    if (!field) return
    const updated = await this.updateFieldUseCase.execute({
      formId: this.form.id,
      field: field.update({ label }),
    })
    runInAction(() => {
      this.form = updated
    })
  }
}
