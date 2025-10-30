import { useCallback, useEffect, useMemo, useState } from 'react'

export type UseInternalStateProps<T> = {
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
  onInternalChange?: (value: T) => void;
  undefinedSync?: boolean;

}

export type UseInternalStateReturn<T> = [T, (value: T) => void, (value: T) => void]
/**
 * Custom hook to manage internal state.
 *
 * @param {UseInternalStateProps} [props] - The properties for the controlled state.
 * @returns {[*, function(*): void, function(*): void]} - The current value and a function to update it.
 */
export function useInternalState<T = unknown>(props: UseInternalStateProps<T>): UseInternalStateReturn<T> {
  const { undefinedSync = true } = props
  const [value, setValue] = useState(props?.defaultValue)

  // Effect to synchronize controlled value with internal state
  useEffect(() => {
    if (typeof props?.value !== 'undefined' || undefinedSync) {
      setValue(props?.value)
    }
  }, [props?.value, undefinedSync])

  const onChange = useCallback(
    (newValue: T) => {
      if (typeof props?.onChange === 'function') {
        props?.onChange?.(newValue)
      } else {
        setValue(newValue)
      }
    },
    [props?.onChange],
  )

  const onInternalChange = useCallback(
    (newValue: T) => {
      setValue(newValue)
      if (typeof props?.onInternalChange === 'function') {
        props?.onInternalChange?.(newValue)
      }
    },
    [props?.onInternalChange],
  )
  const valueToUse = props?.value !== undefined ? props?.value : value

  return useMemo(() => {
    return [valueToUse as T, onChange, onInternalChange]
  }, [valueToUse, onChange, onInternalChange])
}
