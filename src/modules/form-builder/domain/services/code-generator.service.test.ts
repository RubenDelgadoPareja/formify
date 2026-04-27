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
  })
})
