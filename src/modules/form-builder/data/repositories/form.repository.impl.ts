import { Field } from '../../domain/entities/field.entity'
import type { FieldType } from '../../domain/entities/field-type'
import { Form } from '../../domain/entities/form.entity'
import type { FormRepository } from '../../domain/repositories/form.repository'
import type { FormDto, FieldDto } from '../data-sources/local-storage.data-source'
import type { LocalStorageDataSource } from '../data-sources/local-storage.data-source'

function toEntity(dto: FormDto): Form {
  const fields = dto.fields.map(
    (f) =>
      new Field({
        id: f.id,
        type: f.type as FieldType,
        label: f.label,
        required: f.required,
        placeholder: f.placeholder,
        options: f.options ?? [],
      }),
  )
  return new Form({ id: dto.id, title: dto.title, fields })
}

function toDto(form: Form): FormDto {
  const fields: FieldDto[] = form.fields.map((f) => ({
    id: f.id,
    type: f.type,
    label: f.label,
    required: f.required,
    placeholder: f.placeholder,
    options: [...f.options],
  }))
  return { id: form.id, title: form.title, fields }
}

export class FormRepositoryImpl implements FormRepository {
  private readonly dataSource: LocalStorageDataSource

  constructor(dataSource: LocalStorageDataSource) {
    this.dataSource = dataSource
  }

  async findById(id: string): Promise<Form | null> {
    const all = this.dataSource.findAll()
    const dto = all[id]
    return dto ? toEntity(dto) : null
  }

  async save(form: Form): Promise<void> {
    const all = this.dataSource.findAll()
    all[form.id] = toDto(form)
    this.dataSource.saveAll(all)
  }
}
