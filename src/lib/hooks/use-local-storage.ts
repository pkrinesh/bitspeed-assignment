import React from 'react'
import superjson from 'superjson'

type Set<T> = (value: T | ((value: T | undefined) => void)) => void

export function useLocalStorage<T = unknown>(key: string, initialValue: T) {
  const getSnapshot = () => getLocalStorageItem(key)

  const store = React.useSyncExternalStore(useLocalStorageSubscribe, getSnapshot)

  const setState = React.useCallback<Set<T>>(
    (v) => {
      try {
        const nextState = v instanceof Function ? v(superjson.parse<T>(store ?? '')) : v

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key)
        } else {
          setLocalStorageItem(key, nextState)
        }
      } catch (e) {
        console.warn(e)
      }
    },
    [key, store]
  )

  React.useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialValue !== 'undefined') {
      setLocalStorageItem(key, initialValue)
    }
  }, [key, initialValue])

  return [store ? superjson.parse<T>(store) : initialValue, setState] as const
}

// 👇 this will sync the tabs on a page
function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
}

function useLocalStorageSubscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function setLocalStorageItem<T>(key: string, value: T) {
  const stringifiedValue = superjson.stringify(value)
  window.localStorage.setItem(key, stringifiedValue)
  dispatchStorageEvent(key, stringifiedValue)
}

function removeLocalStorageItem(key: string) {
  window.localStorage.removeItem(key)
  dispatchStorageEvent(key, null)
}

function getLocalStorageItem(key: string) {
  return window.localStorage.getItem(key)
}
