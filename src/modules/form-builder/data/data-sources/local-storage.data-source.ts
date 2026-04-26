export interface FieldDto {
  id: string
  type: string
  label: string
  required: boolean
  placeholder: string
}

export interface FormDto {
  id: string
  title: string
  fields: FieldDto[]
}

const STORAGE_KEY = 'formify:forms'

export class LocalStorageDataSource {
  findAll(): Record<string, FormDto> {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, FormDto>
  }

  saveAll(forms: Record<string, FormDto>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms))
  }
}
