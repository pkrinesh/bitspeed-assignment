import type { FlowNode } from '@/lib/types'
import { useNavigate } from '@tanstack/react-router'
import type { Edge } from 'reactflow'
import { toast } from 'sonner'
import { RootNode } from './root-node'
import { Button } from './ui/button'

import { flushSync } from 'react-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

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
  saved,
  onSaved,
  open,
  onToggleOpen,
}: {
  nodes: FlowNode[]
  edges: Edge[]
  saved: boolean
  open: boolean
  onSaved: React.Dispatch<React.SetStateAction<boolean>>
  onToggleOpen: () => void
  onSaveHandler?: (args: { nodes?: FlowNode[]; edges?: Edge[]; justSaving?: boolean }) => void
}) {
  const navigate = useNavigate()
  const dragStartHandler = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const saveHandler = (justSaving = true) => {
    if (nodes.length <= 0) {
      return console.log('There must be at least one node')
    }
    /**
     * Checking node for empty target, which can be determine from
     * the `data.from` property which we have stored before
     */
    const hasEmptyTarget = nodes.filter(({ data }) => data.from.size < 1).length > 1
    if (nodes.length > 1 && hasEmptyTarget) {
      return toast.error('Oops!', {
        description: 'Looks like you have more than one node with empty target',
        position: 'top-center',
      })
    }
    flushSync(() => onSaved(true))

    onSaveHandler && onSaveHandler({ nodes, edges, justSaving })
  }

  const saveAndContinueHandler = () => {
    flushSync(() => {
      onSaved(true)
      saveHandler(false)
    })
    navigate({ to: '/', replace: true })
  }

  const continueHandler = () => {
    flushSync(() => {
      onSaved(true)
    })
    navigate({ to: '/', replace: true })
  }

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4 h-full overflow-hidden">
        <div className="space-y-2">
          <Button className="w-full" disabled={saved} onClick={() => saveHandler()}>
            Save
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              // preventing going to home page when has unsaved data
              if (!saved) return onToggleOpen()
              navigate({ to: '/', replace: true })
            }}
          >
            Back
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
      <AlertDialog open={open} onOpenChange={onToggleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your Changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={continueHandler}>Continue</AlertDialogCancel>
            <AlertDialogAction onClick={saveAndContinueHandler}>
              Save and Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
