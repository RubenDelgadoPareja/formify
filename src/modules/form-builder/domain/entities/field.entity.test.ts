import { describe, it, expect } from 'vitest'
import { Field } from './field.entity'

describe('Field entity', () => {
  describe('construction', () => {
    it('creates a field with all required properties', () => {
      const field = new Field({
        id: 'field-1',
        type: 'text',
        label: 'Full name',
      })

      expect(field.id).toBe('field-1')
      expect(field.type).toBe('text')
      expect(field.label).toBe('Full name')
      expect(field.required).toBe(false)
      expect(field.placeholder).toBe('')
    })

    it('applies default values for optional properties', () => {
      const field = new Field({
        id: 'field-1',
        type: 'email',
        label: 'Email',
      })

      expect(field.required).toBe(false)
      expect(field.placeholder).toBe('')
      expect(field.options).toEqual([])
    })

    it('stores provided options', () => {
      const field = new Field({
        id: 'field-1',
        type: 'select',
        label: 'Size',
        options: ['Small', 'Medium', 'Large'],
      })

      expect(field.options).toEqual(['Small', 'Medium', 'Large'])
    })

    it('respects provided optional properties', () => {
      const field = new Field({
        id: 'field-1',
        type: 'email',
        label: 'Email',
        required: true,
        placeholder: 'you@example.com',
      })

      expect(field.required).toBe(true)
      expect(field.placeholder).toBe('you@example.com')
    })

    it('trims whitespace from the label', () => {
      const field = new Field({
        id: 'field-1',
        type: 'text',
        label: '  Full name  ',
      })

      expect(field.label).toBe('Full name')
    })

    it('throws if the label is empty', () => {
      expect(() => new Field({ id: 'field-1', type: 'text', label: '' })).toThrow(
        'Field label cannot be empty',
      )
    })

    it('throws if the label is only whitespace', () => {
      expect(() => new Field({ id: 'field-1', type: 'text', label: '   ' })).toThrow(
        'Field label cannot be empty',
      )
    })
  })

  describe('update', () => {
    it('returns a new Field instance, leaving the original unchanged', () => {
      const original = new Field({
        id: 'field-1',
        type: 'text',
        label: 'Old label',
      })

      const updated = original.update({ label: 'New label' })

      expect(updated).not.toBe(original)
      expect(original.label).toBe('Old label')
      expect(updated.label).toBe('New label')
    })

    it('keeps the same id after update', () => {
      const original = new Field({
        id: 'field-1',
        type: 'text',
        label: 'Old label',
      })

      const updated = original.update({ label: 'New label' })

      expect(updated.id).toBe('field-1')
    })

    it('updates only the provided properties', () => {
      const original = new Field({
        id: 'field-1',
        type: 'text',
        label: 'Email',
        required: true,
        placeholder: 'placeholder',
      })

      const updated = original.update({ type: 'email' })

      expect(updated.type).toBe('email')
      expect(updated.label).toBe('Email')
      expect(updated.required).toBe(true)
      expect(updated.placeholder).toBe('placeholder')
    })

    it('updates options and preserves other properties', () => {
      const original = new Field({ id: 'field-1', type: 'select', label: 'Size' })
      const updated = original.update({ options: ['S', 'M', 'L'] })

      expect(updated.options).toEqual(['S', 'M', 'L'])
      expect(updated.label).toBe('Size')
    })

    it('preserves existing options when not updated', () => {
      const original = new Field({
        id: 'field-1',
        type: 'select',
        label: 'Size',
        options: ['S', 'M'],
      })
      const updated = original.update({ required: true })

      expect(updated.options).toEqual(['S', 'M'])
    })
  })
})
