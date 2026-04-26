import { LocalStorageDataSource } from './data/data-sources/local-storage.data-source'
import { FormRepositoryImpl } from './data/repositories/form.repository.impl'
import { AddFieldUseCase } from './domain/use-cases/add-field.use-case'

const dataSource = new LocalStorageDataSource()
export const repository = new FormRepositoryImpl(dataSource)
export const addFieldUseCase = new AddFieldUseCase(repository)
