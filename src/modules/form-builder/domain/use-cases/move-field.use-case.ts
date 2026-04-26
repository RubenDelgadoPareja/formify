import type { Form } from '../entities/form.entity'
import type { FormRepository } from '../repositories/form.repository'

export interface MoveFieldInput {
  formId: string
  fromIndex: number
  toIndex: number
}

export class MoveFieldUseCase {
  private readonly repository: FormRepository

  constructor(repository: FormRepository) {
    this.repository = repository
  }

  async execute(input: MoveFieldInput): Promise<Form> {
    const form = await this.repository.findById(input.formId)
    if (!form) throw new Error(`Form not found: ${input.formId}`)

    const updated = form.moveField(input.fromIndex, input.toIndex)
    await this.repository.save(updated)
    return updated
  }
}
