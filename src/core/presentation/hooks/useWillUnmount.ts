import { useEffect } from 'react'

/**
 * Runs the given callback once, when the component unmounts.
 */
export const useWillUnmount = (callback: () => void): void => {
  useEffect(() => {
    return () => {
      callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
