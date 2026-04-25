import { useState } from 'react'
import type { BaseViewModel } from '@/core/presentation/view-models/base/base.viewmodel'
import { useDidMount } from './useDidMount'
import { useWillUnmount } from './useWillUnmount'

/**
 * Connects a View with its ViewModel.
 * - Instantiates the ViewModel only once (on mount).
 * - Calls didMount() when the View mounts.
 * - Calls willUnmount() when the View unmounts.
 *
 * @example
 * const vm = useViewModel(() => new FormBuilderViewModel(addFieldUseCase))
 */
export const useViewModel = <T extends BaseViewModel>(factory: () => T): T => {
  const [instance] = useState<T>(factory)

  useDidMount(async () => {
    await instance.didMount()
  })

  useWillUnmount(() => {
    instance.willUnmount()
  })

  return instance
}
