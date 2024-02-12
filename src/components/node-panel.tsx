import type { FlowNode } from '@/lib/types'
import type { Edge } from 'reactflow'

export function NodePanel({
  nodes,
  edges,
  onSaveHandler,
}: {
  nodes: FlowNode[]
  edges: Edge[]
  onSaveHandler?: (args: { nodes?: FlowNode[]; edges?: Edge[] }) => void
}) {
  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const saveHandler = () => {
    /**
     * Checking node for empty target, which can be determine from
     * the `data.from` property which we have stored before
     */
    const hasEmptyTarget = nodes.filter(({ data }) => data.from.size < 1).length > 1
    if (nodes.length > 1 && hasEmptyTarget) {
      return console.log('Has more empty target elements')
    }

    onSaveHandler && onSaveHandler({ nodes, edges })
  }

  return (
    <>
      <button onClick={saveHandler}>Save</button>
      <div className="">You can drag these nodes to the pane on the right.</div>
      <div className="" onDragStart={(event) => dragStartHandler(event, 'default')} draggable>
        Default Node
      </div>
    </>
  )
}
