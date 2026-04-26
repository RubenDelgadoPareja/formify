import { Field } from '../entities/field.entity'
import { Form } from '../entities/form.entity'
import { FormRepositoryFake } from './fakes/form.repository.fake'
import { RemoveFieldUseCase } from './remove-field.use-case'

const makeField = (id: string, label = 'Label') =>
  new Field({ id, type: 'text', label })

const makeForm = (fields: Field[] = []) =>
  new Form({ id: 'form-1', title: 'My Form', fields })

describe('RemoveFieldUseCase', () => {
  it('removes the field with the given id and returns the updated form', async () => {
    const field = makeField('field-1')
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([field]))
    const useCase = new RemoveFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', fieldId: 'field-1' })

    expect(result.fields).toHaveLength(0)
  })

  it('persists the updated form in the repository', async () => {
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([makeField('field-1')]))
    const useCase = new RemoveFieldUseCase(repo)

    await useCase.execute({ formId: 'form-1', fieldId: 'field-1' })

    const saved = await repo.findById('form-1')
    expect(saved?.fields).toHaveLength(0)
  })

  it('does not mutate the original form', async () => {
    const field = makeField('field-1')
    const original = makeForm([field])
    const repo = new FormRepositoryFake()
    repo.seed(original)
    const useCase = new RemoveFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', fieldId: 'field-1' })

    expect(result).not.toBe(original)
    expect(original.fields).toHaveLength(1)
  })

  it('returns the form unchanged when the field id does not exist', async () => {
    const field = makeField('field-1')
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([field]))
    const useCase = new RemoveFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', fieldId: 'nonexistent' })

    expect(result.fields).toHaveLength(1)
  })

  it('throws when the form does not exist', async () => {
    const repo = new FormRepositoryFake()
    const useCase = new RemoveFieldUseCase(repo)

    await expect(
      useCase.execute({ formId: 'nonexistent', fieldId: 'field-1' }),
    ).rejects.toThrow('Form not found: nonexistent')
  })
})
