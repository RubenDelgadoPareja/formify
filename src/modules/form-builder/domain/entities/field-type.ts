export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'tel'
  | 'date'
  | 'url'
  | 'password'

export const FIELD_TYPES: readonly FieldType[] = [
  'text',
  'email',
  'number',
  'textarea',
  'select',
  'checkbox',
  'tel',
  'date',
  'url',
  'password',
] as const
