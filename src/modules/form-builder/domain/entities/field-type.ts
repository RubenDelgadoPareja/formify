export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox'

export const FIELD_TYPES: readonly FieldType[] = [
  'text',
  'email',
  'number',
  'textarea',
  'select',
  'checkbox',
] as const
