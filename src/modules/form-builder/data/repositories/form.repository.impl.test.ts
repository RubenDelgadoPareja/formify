import { Field } from '../../domain/entities/field.entity'
import { Form } from '../../domain/entities/form.entity'
import { LocalStorageDataSource } from '../data-sources/local-storage.data-source'
import { FormRepositoryImpl } from './form.repository.impl'

const makeField = (id: string, label = 'Label') =>
  new Field({ id, type: 'text', label })

const makeForm = (id = 'form-1', fields: Field[] = []) =>
  new Form({ id, title: 'My Form', fields })

function makeRepo() {
  return new FormRepositoryImpl(new LocalStorageDataSource())
}

beforeEach(() => {
  localStorage.clear()
})

describe('FormRepositoryImpl', () => {
  it('returns null when the form does not exist', async () => {
    const result = await makeRepo().findById('nonexistent')
    expect(result).toBeNull()
  })

  it('saves a form and retrieves it by id', async () => {
    const repo = makeRepo()
    const form = makeForm()

    await repo.save(form)
    const found = await repo.findById('form-1')

    expect(found).not.toBeNull()
    expect(found?.id).toBe('form-1')
    expect(found?.title).toBe('My Form')
  })

  it('restores fields with all their properties', async () => {
    const repo = makeRepo()
    const field = new Field({ id: 'f-1', type: 'email', label: 'Email', required: true, placeholder: 'you@example.com' })
    await repo.save(makeForm('form-1', [field]))

    const found = await repo.findById('form-1')
    const restored = found?.fields[0]

    expect(restored?.id).toBe('f-1')
    expect(restored?.type).toBe('email')
    expect(restored?.label).toBe('Email')
    expect(restored?.required).toBe(true)
    expect(restored?.placeholder).toBe('you@example.com')
  })

  it('overwrites an existing form on save', async () => {
    const repo = makeRepo()
    await repo.save(makeForm('form-1', [makeField('f-1')]))
    await repo.save(makeForm('form-1', [makeField('f-1'), makeField('f-2')]))

    const found = await repo.findById('form-1')
    expect(found?.fields).toHaveLength(2)
  })

  it('stores multiple forms independently', async () => {
    const repo = makeRepo()
    await repo.save(makeForm('form-1'))
    await repo.save(makeForm('form-2'))

    expect(await repo.findById('form-1')).not.toBeNull()
    expect(await repo.findById('form-2')).not.toBeNull()
  })

  it('returns a Form instance (not a plain object)', async () => {
    const repo = makeRepo()
    await repo.save(makeForm())

    const found = await repo.findById('form-1')
    expect(found).toBeInstanceOf(Form)
  })

  it('returns Field instances inside the restored form', async () => {
    const repo = makeRepo()
    await repo.save(makeForm('form-1', [makeField('f-1')]))

    const found = await repo.findById('form-1')
    expect(found?.fields[0]).toBeInstanceOf(Field)
  })
})
