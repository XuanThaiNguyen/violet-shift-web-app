import { useCallback, useEffect, useMemo, useState } from 'react'

export type UseControlledStateProps<T> = {
  defaultValue?: T;
  value?: T;
  onChange?: (value: T) => void;
  undefinedSync?: boolean;
}

export type UseControlledStateReturn<T> = [T, (value: T) => void]
/**
 * Custom hook to manage controlled state.
 *
 * @param {UseControlledStateProps} [props] - The properties for the controlled state.
 * @returns {[*, function(*): void]} - The current value and a function to update it.
 */
export function useControlledState<T = unknown>(props: UseControlledStateProps<T>): UseControlledStateReturn<T> {
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

  const valueToUse = props?.value !== undefined ? props?.value : value

  return useMemo(() => {
    return [valueToUse as T, onChange]
  }, [valueToUse, onChange])
}
