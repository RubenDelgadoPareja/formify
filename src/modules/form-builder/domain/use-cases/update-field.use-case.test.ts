import { Field } from '../entities/field.entity'
import { Form } from '../entities/form.entity'
import { FormRepositoryFake } from './fakes/form.repository.fake'
import { UpdateFieldUseCase } from './update-field.use-case'

const makeField = (id: string, label = 'Label') =>
  new Field({ id, type: 'text', label })

const makeForm = (fields: Field[]) =>
  new Form({ id: 'form-1', title: 'My Form', fields })

describe('UpdateFieldUseCase', () => {
  it('replaces the field with the matching id and returns the updated form', async () => {
    const original = makeField('field-1', 'Old label')
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([original]))
    const useCase = new UpdateFieldUseCase(repo)

    const updated = makeField('field-1', 'New label')
    const result = await useCase.execute({ formId: 'form-1', field: updated })

    expect(result.fields[0].label).toBe('New label')
  })

  it('persists the updated form in the repository', async () => {
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([makeField('field-1', 'Old label')]))
    const useCase = new UpdateFieldUseCase(repo)

    await useCase.execute({ formId: 'form-1', field: makeField('field-1', 'New label') })

    const saved = await repo.findById('form-1')
    expect(saved?.fields[0].label).toBe('New label')
  })

  it('does not mutate the original form', async () => {
    const original = makeForm([makeField('field-1', 'Old label')])
    const repo = new FormRepositoryFake()
    repo.seed(original)
    const useCase = new UpdateFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', field: makeField('field-1', 'New label') })

    expect(result).not.toBe(original)
    expect(original.fields[0].label).toBe('Old label')
  })

  it('returns the form unchanged when the field id does not exist', async () => {
    const field = makeField('field-1')
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([field]))
    const useCase = new UpdateFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', field: makeField('nonexistent') })

    expect(result.fields).toHaveLength(1)
    expect(result.fields[0].id).toBe('field-1')
  })

  it('throws when the form does not exist', async () => {
    const repo = new FormRepositoryFake()
    const useCase = new UpdateFieldUseCase(repo)

    await expect(
      useCase.execute({ formId: 'nonexistent', field: makeField('field-1') }),
    ).rejects.toThrow('Form not found: nonexistent')
  })
})
