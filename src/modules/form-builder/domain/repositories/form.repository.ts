import type { Form } from '../entities/form.entity'

export interface FormRepository {
  findById(id: string): Promise<Form | null>
  save(form: Form): Promise<void>
}
