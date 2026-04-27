import type { Field } from '../entities/field.entity'
import type { Form } from '../entities/form.entity'

export class CodeGeneratorService {
  generate(form: Form): string {
    const { fields } = form
    const componentName = this.toComponentName(form.title)

    const schemaBlock =
      fields.length === 0
        ? 'const schema = z.object({})'
        : [
            'const schema = z.object({',
            ...fields.map((f) => `  ${this.labelToFieldName(f.label)}: ${this.zodFieldSchema(f)},`),
            '})',
          ].join('\n')

    const lines = [
      "import { useForm } from 'react-hook-form'",
      "import { zodResolver } from '@hookform/resolvers/zod'",
      "import { z } from 'zod'",
      '',
      schemaBlock,
      '',
      'type FormValues = z.infer<typeof schema>',
      '',
      `export default function ${componentName}() {`,
      '  const {',
      '    register,',
      '    handleSubmit,',
      '    formState: { errors },',
      '  } = useForm<FormValues>({',
      '    resolver: zodResolver(schema),',
      '  })',
      '',
      '  const onSubmit = (data: FormValues) => {',
      '    console.log(data)',
      '  }',
      '',
      '  return (',
      '    <form onSubmit={handleSubmit(onSubmit)} noValidate>',
      ...fields.map((f) => this.renderField(f)),
      '      <button type="submit">Submit</button>',
      '    </form>',
      '  )',
      '}',
    ]

    return lines.join('\n')
  }

  labelToFieldName(label: string): string {
    const words = label.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean)
    return words
      .map((word, i) =>
        i === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('')
  }

  toComponentName(title: string): string {
    return title
      .trim()
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }

  private zodFieldSchema(field: Field): string {
    const { type, label, required } = field

    if (type === 'checkbox') return 'z.boolean()'

    if (type === 'email') {
      return required
        ? `z.string().email('Invalid email').min(1, '${label} is required')`
        : `z.string().email('Invalid email').optional()`
    }

    if (type === 'number') {
      return required
        ? `z.coerce.number({ message: '${label} is required' })`
        : `z.coerce.number().optional()`
    }

    return required
      ? `z.string().min(1, '${label} is required')`
      : `z.string().optional()`
  }

  private renderField(field: Field): string {
    const name = this.labelToFieldName(field.label)
    const { type, label, placeholder } = field
    const ph = placeholder ? ` placeholder="${placeholder}"` : ''
    const lines: string[] = []

    lines.push('      <div>')
    lines.push(`        <label htmlFor="${name}">${label}</label>`)

    if (type === 'textarea') {
      lines.push(`        <textarea id="${name}"${ph} {...register('${name}')} />`)
    } else if (type === 'select') {
      lines.push(`        <select id="${name}" {...register('${name}')}>`)
      lines.push(`          <option value="">Select an option</option>`)
      lines.push(`        </select>`)
    } else if (type === 'checkbox') {
      lines.push(`        <input id="${name}" type="checkbox" {...register('${name}')} />`)
    } else {
      lines.push(`        <input id="${name}" type="${type}"${ph} {...register('${name}')} />`)
    }

    if (type !== 'checkbox') {
      lines.push(`        {errors.${name} && <span>{errors.${name}.message}</span>}`)
    }

    lines.push('      </div>')

    return lines.join('\n')
  }
}
