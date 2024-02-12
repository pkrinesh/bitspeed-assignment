import { cn } from '@/lib/utils'
import { type ComponentProps } from 'react'

export function TheSidebar({ className, ...restProps }: ComponentProps<'aside'>) {
  return (
    <aside
      className={cn('w-80 border-l border-border bg-card px-4 py-3', className)}
      {...restProps}
    />
  )
}
