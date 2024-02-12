import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

import { TheFlow } from '@/components/the-flow'
import { TheSidebar } from '@/components/the-sidebar'
import { NodeSchema } from '@/lib/schema'
import { NodeEditForm } from '@/components/node-edit-form'
import { NodePanel } from '@/components/node-panel'
import { ComponentRef, useRef } from 'react'
import { useFlows } from '@/lib/hooks/use-flows'
import { nanoid } from 'nanoid'
import { Flow } from '@/lib/types'

export const Route = createFileRoute('/flow/new')({
  component: NewFlow,
  validateSearch: (search) =>
    z
      .object({
        nodeId: z.string().optional(),
        nodes: z.array(NodeSchema).optional(),
      })
      .parse(search),
})

function NewFlow() {
  const navigate = useNavigate()
  const search = useSearch({ from: Route.fullPath })
  const ref = useRef<ComponentRef<typeof NodeEditForm> | null>(null)
  const [, setFlows] = useFlows()

  const saveFlowHandler = (flow: Pick<Flow, 'edges' | 'nodes'>) => {
    /**
     * storing data to the local storage as of now, can be stored anywhere
     * just have to modified the code from the `useFlow` hooks
     */
    setFlows((prev) => {
      return [
        ...(prev ?? []),
        {
          id: nanoid(),
          name: 'Name',
          nodes: flow?.nodes,
          edges: flow?.edges,
        },
      ]
    })

    navigate({ to: '/', replace: true })
  }

  /**
   * Here I am using render props for Sidebar because component in the Sidebar
   * needs some the methods or states from the Flow so without lifting state
   * or using Context or any global state we can simply use render props
   *
   * We can use the primitive pattern but for that we have to use context,
   * because of the it will get complected letter in the future
   * and there is only two component so we can avoid this
   *
   * Advantage:
   * 1. we can use this Flow component in multiple place (create, edit or show pages)
   * 2. State will be close to the component so it will be easier to maintain
   */
  return (
    <TheFlow
      onClick={() => {
        if (search.nodeId) {
          navigate({ to: Route.fullPath, replace: true })
        }
      }}
      onNodeClick={(node) => {
        ref?.current?.focus()
        navigate({ to: Route.fullPath, search: { nodeId: node?.id } })
      }}
    >
      {({ nodes, edges, setNodes }) => (
        <TheSidebar>
          {search.nodeId ? (
            <NodeEditForm
              ref={ref}
              nodes={nodes}
              onSetNodes={setNodes}
              nodeId={search.nodeId}
              onSaveHandler={() => navigate({ to: Route.fullPath, replace: true })}
            />
          ) : (
            <NodePanel nodes={nodes} edges={edges} onSaveHandler={saveFlowHandler} />
          )}
        </TheSidebar>
      )}
    </TheFlow>
  )
}
