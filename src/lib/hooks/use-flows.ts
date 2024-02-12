import { Flow } from '@/lib/types'
import { useLocalStorage } from './use-local-storage'

export function useFlows() {
  return useLocalStorage<Flow[]>('flows', [])
}
