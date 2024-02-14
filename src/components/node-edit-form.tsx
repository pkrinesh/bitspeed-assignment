import type { FlowNode } from '@/lib/types'
import { useSearch } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

type NodeEditProps = {
  nodes: FlowNode[]
  nodeId: string
  onSetNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>
  onSaveHandler?: (nodes?: FlowNode[]) => void
}

export function NodeEditForm({ nodes, onSetNodes, onSaveHandler, nodeId }: NodeEditProps) {
  const search: { nodeValue?: string } = useSearch({ strict: false })
  const inputRef = useRef<React.ComponentRef<'input'>>(null)
  const [value, setValue] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setValue(search?.nodeValue ?? '')
  }, [search])

  const saveNodeValueHandler = (e: React.FormEvent) => {
    e.preventDefault()

    if (value.length < 3) {
      setIsError(true)
      inputRef?.current?.focus()
      return
    }

    const newNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        node.data = {
          ...node.data,
          label: value,
        }
      }
      return node
    })

    onSetNodes(newNodes)
    setValue('')
    setIsError(false)
    onSaveHandler && onSaveHandler()
  }

  return (
    <form onSubmit={saveNodeValueHandler} className="space-y-2">
      <Input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) => {
          setIsError(false)
          setValue(e.target.value)
        }}
      />
      {isError && (
        <p className="text-sm text-destructive font-semibold">
          Text must be at least 3 characters.
        </p>
      )}
      <Button className="w-full border border-border" variant="secondary" type="submit">
        Save
      </Button>
    </form>
  )
}
