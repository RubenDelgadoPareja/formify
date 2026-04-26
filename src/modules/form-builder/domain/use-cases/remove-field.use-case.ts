import type { Form } from '../entities/form.entity'
import type { FormRepository } from '../repositories/form.repository'

export interface RemoveFieldInput {
  formId: string
  fieldId: string
}

export class RemoveFieldUseCase {
  private readonly repository: FormRepository

  constructor(repository: FormRepository) {
    this.repository = repository
  }

  async execute(input: RemoveFieldInput): Promise<Form> {
    const form = await this.repository.findById(input.formId)
    if (!form) throw new Error(`Form not found: ${input.formId}`)

    const updated = form.removeField(input.fieldId)
    await this.repository.save(updated)
    return updated
  }
}
