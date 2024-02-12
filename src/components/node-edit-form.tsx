import type { FlowNode } from '@/lib/types'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

type NodeEditProps = {
  nodes: FlowNode[]
  nodeId: string
  onSetNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>
  onSaveHandler?: (nodes?: FlowNode[]) => void
}

export const NodeEditForm = forwardRef<HTMLInputElement, NodeEditProps>(function NodeEditForm(
  { nodes, onSetNodes, onSaveHandler, nodeId },
  ref
) {
  const inputRef = useRef<React.ComponentRef<'input'>>(null)
  const [value, setValue] = useState('')

  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef?.current?.focus()
        },
      } as HTMLInputElement
    },
    []
  )

  const saveNodeValueHandler = (e: React.MouseEvent) => {
    e.preventDefault()

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
    onSaveHandler && onSaveHandler()
  }

  return (
    <form>
      <input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border"
      />
      <button type="submit" onClick={saveNodeValueHandler}>
        Save
      </button>
    </form>
  )
})
