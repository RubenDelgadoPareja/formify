import { Field } from '../entities/field.entity'
import { Form } from '../entities/form.entity'
import { FormRepositoryFake } from './fakes/form.repository.fake'
import { AddFieldUseCase } from './add-field.use-case'

const makeForm = (id = 'form-1') =>
  new Form({ id, title: 'My Form' })

const makeField = (id: string, label = 'Label') =>
  new Field({ id, type: 'text', label })

describe('AddFieldUseCase', () => {
  it('appends the field to the form and returns the updated form', async () => {
    const repo = new FormRepositoryFake()
    repo.seed(makeForm())
    const useCase = new AddFieldUseCase(repo)

    const field = makeField('field-1')
    const result = await useCase.execute({ formId: 'form-1', field })

    expect(result.fields).toHaveLength(1)
    expect(result.fields[0]).toBe(field)
  })

  it('persists the updated form in the repository', async () => {
    const repo = new FormRepositoryFake()
    repo.seed(makeForm())
    const useCase = new AddFieldUseCase(repo)

    await useCase.execute({ formId: 'form-1', field: makeField('field-1') })

    const saved = await repo.findById('form-1')
    expect(saved?.fields).toHaveLength(1)
  })

  it('does not mutate the original form', async () => {
    const repo = new FormRepositoryFake()
    const original = makeForm()
    repo.seed(original)
    const useCase = new AddFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', field: makeField('field-1') })

    expect(result).not.toBe(original)
    expect(original.fields).toHaveLength(0)
  })

  it('throws when the form does not exist', async () => {
    const repo = new FormRepositoryFake()
    const useCase = new AddFieldUseCase(repo)

    await expect(
      useCase.execute({ formId: 'nonexistent', field: makeField('field-1') }),
    ).rejects.toThrow('Form not found: nonexistent')
  })
})
