import { useEffect } from 'react'

/**
 * Runs the given callback once, when the component mounts.
 */
export const useDidMount = (callback: () => void | Promise<void>): void => {
  useEffect(() => {
    void callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
