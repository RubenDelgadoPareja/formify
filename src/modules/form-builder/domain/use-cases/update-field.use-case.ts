import type { Field } from '../entities/field.entity'
import type { Form } from '../entities/form.entity'
import type { FormRepository } from '../repositories/form.repository'

export interface UpdateFieldInput {
  formId: string
  field: Field
}

export class UpdateFieldUseCase {
  private readonly repository: FormRepository

  constructor(repository: FormRepository) {
    this.repository = repository
  }

  async execute(input: UpdateFieldInput): Promise<Form> {
    const form = await this.repository.findById(input.formId)
    if (!form) throw new Error(`Form not found: ${input.formId}`)

    const updated = form.updateField(input.field)
    await this.repository.save(updated)
    return updated
  }
}
