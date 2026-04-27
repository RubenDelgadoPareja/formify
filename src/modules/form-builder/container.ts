import { LocalStorageDataSource } from './data/data-sources/local-storage.data-source'
import { FormRepositoryImpl } from './data/repositories/form.repository.impl'
import { CodeGeneratorService } from './domain/services/code-generator.service'
import { AddFieldUseCase } from './domain/use-cases/add-field.use-case'
import { MoveFieldUseCase } from './domain/use-cases/move-field.use-case'
import { RemoveFieldUseCase } from './domain/use-cases/remove-field.use-case'
import { UpdateFieldUseCase } from './domain/use-cases/update-field.use-case'

const dataSource = new LocalStorageDataSource()
export const repository = new FormRepositoryImpl(dataSource)
export const codeGeneratorService = new CodeGeneratorService()
export const addFieldUseCase = new AddFieldUseCase(repository)
export const removeFieldUseCase = new RemoveFieldUseCase(repository)
export const moveFieldUseCase = new MoveFieldUseCase(repository)
export const updateFieldUseCase = new UpdateFieldUseCase(repository)
