import { Field } from './field.entity'

export interface FormProps {
  id: string
  title: string
  fields?: Field[]
}

export class Form {
  readonly id: string
  readonly title: string
  readonly fields: readonly Field[]

  constructor(props: FormProps) {
    if (!props.title.trim()) {
      throw new Error('Form title cannot be empty')
    }

    const fields = props.fields ?? []

    const ids = fields.map((f) => f.id)
    const uniqueIds = new Set(ids)
    if (ids.length !== uniqueIds.size) {
      throw new Error('Form cannot contain duplicate field ids')
    }

    this.id = props.id
    this.title = props.title.trim()
    this.fields = fields
  }

  /**
   * Returns a new Form with the given field appended at the end.
   */
  addField(field: Field): Form {
    return new Form({
      id: this.id,
      title: this.title,
      fields: [...this.fields, field],
    })
  }

  /**
   * Returns a new Form without the field with the given id.
   * If the id doesn't exist, returns the same Form unchanged.
   */
  removeField(fieldId: string): Form {
    return new Form({
      id: this.id,
      title: this.title,
      fields: this.fields.filter((f) => f.id !== fieldId),
    })
  }

  /**
   * Returns a new Form with the field at fromIndex moved to toIndex.
   */
  moveField(fromIndex: number, toIndex: number): Form {
    if (fromIndex < 0 || fromIndex >= this.fields.length) {
      throw new Error(`Invalid fromIndex: ${fromIndex}`)
    }
    if (toIndex < 0 || toIndex >= this.fields.length) {
      throw new Error(`Invalid toIndex: ${toIndex}`)
    }

    const reordered = [...this.fields]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    return new Form({
      id: this.id,
      title: this.title,
      fields: reordered,
    })
  }

  /**
   * Returns a new Form with the given field replaced (matched by id).
   * If no field with that id exists, returns the same Form unchanged.
   */
  updateField(updated: Field): Form {
    return new Form({
      id: this.id,
      title: this.title,
      fields: this.fields.map((f) => (f.id === updated.id ? updated : f)),
    })
  }
}
