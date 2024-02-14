import type { FlowNode } from '@/lib/types'
import { useNavigate } from '@tanstack/react-router'
import type { Edge } from 'reactflow'
import { toast } from 'sonner'
import { RootNode } from './root-node'
import { Button } from './ui/button'

const items = [
  {
    name: 'textMessage',
    element: () => (
      <RootNode>
        <p>New text Message</p>
      </RootNode>
    ),
  },
] as const

export function NodePanel({
  nodes,
  edges,
  onSaveHandler,
}: {
  nodes: FlowNode[]
  edges: Edge[]
  onSaveHandler?: (args: { nodes?: FlowNode[]; edges?: Edge[] }) => void
}) {
  const navigate = useNavigate()
  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const saveHandler = () => {
    if (nodes.length <= 0) {
      return console.log('There must be at least one node')
    }
    /**
     * Checking node for empty target, which can be determine from
     * the `data.from` property which we have stored before
     */
    const hasEmptyTarget = nodes.filter(({ data }) => data.from.size < 1).length > 1
    if (nodes.length > 1 && hasEmptyTarget) {
      return toast.error("Oops! Can't save", {
        description: 'Looks like you have more than one node with empty target',
        position: 'top-center',
      })
    }

    onSaveHandler && onSaveHandler({ nodes, edges })
  }

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4 h-full overflow-hidden">
        <div className="space-y-2">
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => {
              saveHandler()
              navigate({ to: '/', replace: true })
            }}
          >
            Save and back
          </Button>
          <Button className="w-full" onClick={saveHandler}>
            Save
          </Button>
        </div>
        <div className="h-[1px] w-full bg-border" />
        <div>
          {items.map((item) => (
            <div
              key={item.name}
              onDragStart={(event) => dragStartHandler(event, item.name)}
              draggable
            >
              <item.element />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
