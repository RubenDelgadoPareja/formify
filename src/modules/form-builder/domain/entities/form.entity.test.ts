import { describe, it, expect } from 'vitest'
import { Form } from './form.entity'
import { Field } from './field.entity'

const makeField = (id: string, label = `Field ${id}`) => new Field({ id, type: 'text', label })

describe('Form entity', () => {
  describe('construction', () => {
    it('creates a form with the given id and title', () => {
      const form = new Form({ id: 'form-1', title: 'Contact form' })

      expect(form.id).toBe('form-1')
      expect(form.title).toBe('Contact form')
      expect(form.fields).toEqual([])
    })

    it('trims whitespace from the title', () => {
      const form = new Form({ id: 'form-1', title: '  Contact  ' })

      expect(form.title).toBe('Contact')
    })

    it('throws if the title is empty', () => {
      expect(() => new Form({ id: 'form-1', title: '' })).toThrow('Form title cannot be empty')
    })

    it('throws if the title is only whitespace', () => {
      expect(() => new Form({ id: 'form-1', title: '   ' })).toThrow('Form title cannot be empty')
    })

    it('accepts an initial list of fields', () => {
      const fields = [makeField('a'), makeField('b')]
      const form = new Form({ id: 'form-1', title: 'F', fields })

      expect(form.fields).toHaveLength(2)
      expect(form.fields[0].id).toBe('a')
      expect(form.fields[1].id).toBe('b')
    })

    it('throws if there are duplicate field ids', () => {
      const fields = [makeField('a'), makeField('a')]

      expect(() => new Form({ id: 'form-1', title: 'F', fields })).toThrow(
        'Form cannot contain duplicate field ids',
      )
    })
  })

  describe('addField', () => {
    it('returns a new Form with the field appended', () => {
      const form = new Form({ id: 'form-1', title: 'F' })
      const updated = form.addField(makeField('a'))

      expect(updated).not.toBe(form)
      expect(form.fields).toHaveLength(0)
      expect(updated.fields).toHaveLength(1)
      expect(updated.fields[0].id).toBe('a')
    })

    it('appends at the end, preserving order', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a'), makeField('b')],
      })
      const updated = form.addField(makeField('c'))

      expect(updated.fields.map((f) => f.id)).toEqual(['a', 'b', 'c'])
    })

    it('throws if the new field id already exists', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a')],
      })

      expect(() => form.addField(makeField('a'))).toThrow('Form cannot contain duplicate field ids')
    })
  })

  describe('removeField', () => {
    it('returns a new Form without the field', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a'), makeField('b')],
      })
      const updated = form.removeField('a')

      expect(updated.fields.map((f) => f.id)).toEqual(['b'])
    })

    it('returns a Form unchanged if the id does not exist', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a')],
      })
      const updated = form.removeField('z')

      expect(updated.fields.map((f) => f.id)).toEqual(['a'])
    })
  })

  describe('moveField', () => {
    it('moves a field from one position to another', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a'), makeField('b'), makeField('c')],
      })
      const updated = form.moveField(0, 2)

      expect(updated.fields.map((f) => f.id)).toEqual(['b', 'c', 'a'])
    })

    it('throws if fromIndex is out of range', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a')],
      })

      expect(() => form.moveField(5, 0)).toThrow('Invalid fromIndex: 5')
    })

    it('throws if toIndex is out of range', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a')],
      })

      expect(() => form.moveField(0, 5)).toThrow('Invalid toIndex: 5')
    })
  })

  describe('updateField', () => {
    it('replaces the field with the same id', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a', 'Old'), makeField('b')],
      })
      const updated = form.updateField(makeField('a', 'New'))

      expect(updated.fields[0].label).toBe('New')
      expect(updated.fields[1].label).toBe('Field b')
    })

    it('returns a Form unchanged if no field matches the id', () => {
      const form = new Form({
        id: 'form-1',
        title: 'F',
        fields: [makeField('a')],
      })
      const updated = form.updateField(makeField('z', 'X'))

      expect(updated.fields.map((f) => f.id)).toEqual(['a'])
    })
  })
})
