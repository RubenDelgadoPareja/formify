import { Field } from '../entities/field.entity'
import { Form } from '../entities/form.entity'
import { FormRepositoryFake } from './fakes/form.repository.fake'
import { MoveFieldUseCase } from './move-field.use-case'

const makeField = (id: string, label = 'Label') =>
  new Field({ id, type: 'text', label })

const makeForm = (fields: Field[]) =>
  new Form({ id: 'form-1', title: 'My Form', fields })

describe('MoveFieldUseCase', () => {
  it('moves a field from one index to another and returns the updated form', async () => {
    const [a, b, c] = [makeField('a'), makeField('b'), makeField('c')]
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([a, b, c]))
    const useCase = new MoveFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', fromIndex: 0, toIndex: 2 })

    expect(result.fields.map((f) => f.id)).toEqual(['b', 'c', 'a'])
  })

  it('persists the reordered form in the repository', async () => {
    const [a, b] = [makeField('a'), makeField('b')]
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([a, b]))
    const useCase = new MoveFieldUseCase(repo)

    await useCase.execute({ formId: 'form-1', fromIndex: 0, toIndex: 1 })

    const saved = await repo.findById('form-1')
    expect(saved?.fields.map((f) => f.id)).toEqual(['b', 'a'])
  })

  it('does not mutate the original form', async () => {
    const [a, b] = [makeField('a'), makeField('b')]
    const original = makeForm([a, b])
    const repo = new FormRepositoryFake()
    repo.seed(original)
    const useCase = new MoveFieldUseCase(repo)

    const result = await useCase.execute({ formId: 'form-1', fromIndex: 0, toIndex: 1 })

    expect(result).not.toBe(original)
    expect(original.fields.map((f) => f.id)).toEqual(['a', 'b'])
  })

  it('throws when the form does not exist', async () => {
    const repo = new FormRepositoryFake()
    const useCase = new MoveFieldUseCase(repo)

    await expect(
      useCase.execute({ formId: 'nonexistent', fromIndex: 0, toIndex: 1 }),
    ).rejects.toThrow('Form not found: nonexistent')
  })

  it('throws when fromIndex is out of bounds', async () => {
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([makeField('a')]))
    const useCase = new MoveFieldUseCase(repo)

    await expect(
      useCase.execute({ formId: 'form-1', fromIndex: 5, toIndex: 0 }),
    ).rejects.toThrow('Invalid fromIndex: 5')
  })

  it('throws when toIndex is out of bounds', async () => {
    const repo = new FormRepositoryFake()
    repo.seed(makeForm([makeField('a')]))
    const useCase = new MoveFieldUseCase(repo)

    await expect(
      useCase.execute({ formId: 'form-1', fromIndex: 0, toIndex: 5 }),
    ).rejects.toThrow('Invalid toIndex: 5')
  })
})
