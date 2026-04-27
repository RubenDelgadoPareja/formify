import { Field } from '../entities/field.entity'
import { Form } from '../entities/form.entity'
import { CodeGeneratorService } from './code-generator.service'

describe('CodeGeneratorService', () => {
  let service: CodeGeneratorService

  beforeEach(() => {
    service = new CodeGeneratorService()
  })

  describe('generate', () => {
    it('includes the required imports', () => {
      const form = new Form({ id: '1', title: 'Test Form' })
      const output = service.generate(form)

      expect(output).toContain("import { useForm } from 'react-hook-form'")
      expect(output).toContain("import { zodResolver } from '@hookform/resolvers/zod'")
      expect(output).toContain("import { z } from 'zod'")
    })

    it('derives the component name from the form title', () => {
      const form = new Form({ id: '1', title: 'Contact Form' })
      const output = service.generate(form)

      expect(output).toContain('export default function ContactForm()')
    })

    it('generates an empty schema for a form with no fields', () => {
      const form = new Form({ id: '1', title: 'Empty Form' })
      const output = service.generate(form)

      expect(output).toContain('const schema = z.object({})')
    })

    it('generates Zod schema entries for each field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [
          new Field({ id: 'f1', type: 'text', label: 'Full Name', required: true }),
          new Field({ id: 'f2', type: 'email', label: 'Email', required: false }),
        ],
      })
      const output = service.generate(form)

      expect(output).toContain("fullName: z.string().min(1, 'Full Name is required'),")
      expect(output).toContain("email: z.string().email('Invalid email').optional(),")
    })

    it('generates HTML for a required text field with placeholder', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [
          new Field({ id: 'f1', type: 'text', label: 'First Name', required: true, placeholder: 'Enter name' }),
        ],
      })
      const output = service.generate(form)

      expect(output).toContain('<label htmlFor="firstName">First Name</label>')
      expect(output).toContain(`<input id="firstName" type="text" placeholder="Enter name" {...register('firstName')} />`)
      expect(output).toContain('{errors.firstName && <span>{errors.firstName.message}</span>}')
    })

    it('does not render placeholder attribute when placeholder is empty', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'text', label: 'Name', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain(`<input id="name" type="text" {...register('name')} />`)
    })

    it('generates textarea element for textarea type', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'textarea', label: 'Message', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain(`<textarea id="message" {...register('message')} />`)
      expect(output).toContain("{errors.message && <span>{errors.message.message}</span>}")
    })

    it('generates select with a default empty option', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'select', label: 'Country', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain(`<select id="country" {...register('country')}>`)
      expect(output).toContain('<option value="">Select an option</option>')
      expect(output).toContain('</select>')
    })

    it('generates checkbox input and uses z.boolean()', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'checkbox', label: 'Subscribe', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain(`<input id="subscribe" type="checkbox" {...register('subscribe')} />`)
      expect(output).toContain('subscribe: z.boolean(),')
    })

    it('does not render an error block for checkbox', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'checkbox', label: 'Accept Terms', required: false })],
      })
      const output = service.generate(form)

      expect(output).not.toContain('errors.acceptTerms')
    })

    it('generates z.coerce.number for required number field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'number', label: 'Age', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain("age: z.coerce.number({ message: 'Age is required' }),")
    })

    it('generates z.coerce.number().optional() for optional number field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'number', label: 'Age', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain('age: z.coerce.number().optional(),')
    })

    it('generates z.string().optional() for optional email field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'email', label: 'Email', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain("email: z.string().email('Invalid email').optional(),")
    })

    it('renders a submit button', () => {
      const form = new Form({ id: '1', title: 'My Form' })
      const output = service.generate(form)

      expect(output).toContain('<button type="submit">Submit</button>')
    })

    it('generates phone regex validation for required tel field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'tel', label: 'Phone', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain("phone: z.string().regex(")
      expect(output).toContain("'Invalid phone number'")
      expect(output).toContain(".min(1, 'Phone is required')")
      expect(output).toContain(`<input id="phone" type="tel" {...register('phone')} />`)
    })

    it('generates optional phone validation for non-required tel field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'tel', label: 'Phone', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain("'Invalid phone number'")
      expect(output).toContain('.optional()')
    })

    it('generates z.coerce.date() for required date field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'date', label: 'Birth Date', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain('birthDate: z.coerce.date(),')
      expect(output).toContain(`<input id="birthDate" type="date" {...register('birthDate')} />`)
    })

    it('generates z.coerce.date().optional() for non-required date field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'date', label: 'Birth Date', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain('birthDate: z.coerce.date().optional(),')
    })

    it('does not include placeholder attribute for date input', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'date', label: 'Birth Date', required: true, placeholder: 'ignored' })],
      })
      const output = service.generate(form)

      expect(output).toContain(`<input id="birthDate" type="date" {...register('birthDate')} />`)
      expect(output).not.toContain('placeholder="ignored"')
    })

    it('generates url validation for required url field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'url', label: 'Website', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain("website: z.string().url('Invalid URL').min(1, 'Website is required'),")
      expect(output).toContain(`<input id="website" type="url" {...register('website')} />`)
    })

    it('generates optional url validation for non-required url field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'url', label: 'Website', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain("website: z.string().url('Invalid URL').optional(),")
    })

    it('generates password min length validation for required password field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'password', label: 'Password', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain("password: z.string().min(8, 'Password must be at least 8 characters'),")
      expect(output).toContain(`<input id="password" type="password" {...register('password')} />`)
    })

    it('generates optional password validation for non-required password field', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'password', label: 'Password', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain("password: z.string().min(8, 'Password must be at least 8 characters').optional(),")
    })
  })

  describe('labelToFieldName', () => {
    it('converts a single word to lowercase', () => {
      expect(service.labelToFieldName('Email')).toBe('email')
    })

    it('converts a multi-word label to camelCase', () => {
      expect(service.labelToFieldName('Full Name')).toBe('fullName')
      expect(service.labelToFieldName('First Last Name')).toBe('firstLastName')
    })

    it('treats hyphens and underscores as word separators', () => {
      expect(service.labelToFieldName('some-field_name')).toBe('someFieldName')
    })

    it('trims leading and trailing spaces', () => {
      expect(service.labelToFieldName('  Email  ')).toBe('email')
    })

    it('lowercases each word beyond the first', () => {
      expect(service.labelToFieldName('FULL NAME')).toBe('fullName')
    })

    it('strips accents from vowels', () => {
      expect(service.labelToFieldName('Número')).toBe('numero')
      expect(service.labelToFieldName('Dirección')).toBe('direccion')
      expect(service.labelToFieldName('Teléfono')).toBe('telefono')
    })

    it('converts ñ to n', () => {
      expect(service.labelToFieldName('Año')).toBe('ano')
      expect(service.labelToFieldName('Número de teléfono')).toBe('numeroDeTelefono')
    })
  })

  describe('toComponentName', () => {
    it('converts a single word to PascalCase', () => {
      expect(service.toComponentName('form')).toBe('Form')
    })

    it('converts a multi-word title to PascalCase', () => {
      expect(service.toComponentName('Contact Form')).toBe('ContactForm')
    })

    it('trims and handles special characters', () => {
      expect(service.toComponentName('  my form  ')).toBe('MyForm')
    })

    it('lowercases the tail of each word', () => {
      expect(service.toComponentName('MY FORM')).toBe('MyForm')
    })

    it('strips accents from form title', () => {
      expect(service.toComponentName('Formulario de Contacto')).toBe('FormularioDeContacto')
    })
  })

  describe('non-ASCII warning', () => {
    it('adds a WARNING comment in the schema for a field with accented label', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'text', label: 'Número', required: true })],
      })
      const output = service.generate(form)

      expect(output).toContain('// WARNING: "Número" contains non-ASCII characters')
      expect(output).toContain('numero: z.string().min(1,')
    })

    it('adds a WARNING comment for labels containing ñ', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'text', label: 'Año', required: false })],
      })
      const output = service.generate(form)

      expect(output).toContain('// WARNING: "Año" contains non-ASCII characters')
    })

    it('does not add a WARNING comment for pure ASCII labels', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [new Field({ id: 'f1', type: 'text', label: 'Full Name', required: true })],
      })
      const output = service.generate(form)

      expect(output).not.toContain('// WARNING')
    })

    it('only warns on the affected field, not on others', () => {
      const form = new Form({
        id: '1',
        title: 'My Form',
        fields: [
          new Field({ id: 'f1', type: 'text', label: 'Name', required: true }),
          new Field({ id: 'f2', type: 'text', label: 'Dirección', required: true }),
        ],
      })
      const output = service.generate(form)

      const warnings = (output.match(/\/\/ WARNING/g) ?? []).length
      expect(warnings).toBe(1)
      expect(output).toContain('// WARNING: "Dirección"')
    })
  })
})
