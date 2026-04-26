import type { Form } from '../../entities/form.entity'
import type { FormRepository } from '../../repositories/form.repository'

export class FormRepositoryFake implements FormRepository {
  private store = new Map<string, Form>()

  seed(form: Form): void {
    this.store.set(form.id, form)
  }

  async findById(id: string): Promise<Form | null> {
    return this.store.get(id) ?? null
  }

  async save(form: Form): Promise<void> {
    this.store.set(form.id, form)
  }
}
