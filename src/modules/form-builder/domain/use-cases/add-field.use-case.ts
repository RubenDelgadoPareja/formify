import type { Field } from '../entities/field.entity'
import type { Form } from '../entities/form.entity'
import type { FormRepository } from '../repositories/form.repository'

export interface AddFieldInput {
  formId: string
  field: Field
}

export class AddFieldUseCase {
  private readonly repository: FormRepository

  constructor(repository: FormRepository) {
    this.repository = repository
  }

  async execute(input: AddFieldInput): Promise<Form> {
    const form = await this.repository.findById(input.formId)
    if (!form) throw new Error(`Form not found: ${input.formId}`)

    const updated = form.addField(input.field)
    await this.repository.save(updated)
    return updated
  }
}
