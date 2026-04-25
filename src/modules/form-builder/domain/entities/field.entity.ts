import type { FieldType } from './field-type'

export interface FieldProps {
  id: string
  type: FieldType
  label: string
  required?: boolean
  placeholder?: string
}

export class Field {
  readonly id: string
  readonly type: FieldType
  readonly label: string
  readonly required: boolean
  readonly placeholder: string

  constructor(props: FieldProps) {
    if (!props.label.trim()) {
      throw new Error('Field label cannot be empty')
    }

    this.id = props.id
    this.type = props.type
    this.label = props.label.trim()
    this.required = props.required ?? false
    this.placeholder = props.placeholder ?? ''
  }

  /**
   * Returns a new Field with updated properties.
   * Entities are immutable: any change creates a new instance.
   */
  update(changes: Partial<Omit<FieldProps, 'id'>>): Field {
    return new Field({
      id: this.id,
      type: changes.type ?? this.type,
      label: changes.label ?? this.label,
      required: changes.required ?? this.required,
      placeholder: changes.placeholder ?? this.placeholder,
    })
  }
}
