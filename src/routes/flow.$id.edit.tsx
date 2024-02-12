import { NodeEditForm } from '@/components/node-edit-form'
import { NodePanel } from '@/components/node-panel'
import { TheFlow } from '@/components/the-flow'
import { TheSidebar } from '@/components/the-sidebar'
import { useFlows } from '@/lib/hooks/use-flows'
import { NodeSchema } from '@/lib/schema'
import { Flow } from '@/lib/types'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ComponentRef, useMemo, useRef } from 'react'
import 'reactflow/dist/style.css'
import { z } from 'zod'

export const Route = createFileRoute('/flow/$id/edit')({
  component: EditFlow,
  validateSearch: (search) =>
    z
      .object({
        nodeId: z.string().optional(),
        nodes: z.array(NodeSchema).optional(),
      })
      .parse(search),
})

function EditFlow() {
  const navigate = useNavigate()
  const params = Route.useParams()
  const search = Route.useSearch()
  const ref = useRef<ComponentRef<typeof NodeEditForm> | null>(null)

  const [flows, setFlows] = useFlows()
  const flow = useMemo(() => flows?.find((flow) => flow.id === params.id), [params, flows])

  const saveFlowHandler = (data: Pick<Flow, 'edges' | 'nodes'>) => {
    /**
     * storing data to the local storage as of now, can be stored anywhere
     * just have to modified the code from the `useFlow` hooks
     */
    setFlows((prev) => {
      return [
        ...(prev?.map((flow) => {
          if (flow.id === params.id) {
            return {
              ...flow,
              nodes: data?.nodes,
              edges: data?.edges,
            }
          }
          return flow
        }) ?? []),
      ]
    })

    navigate({ to: '/', replace: true })
  }

  return (
    <TheFlow
      flow={flow}
      onClick={() => {
        if (search.nodeId) {
          navigate({ to: Route.fullPath, params: { id: params.id }, replace: true })
        }
      }}
      onNodeClick={(node) => {
        ref?.current?.focus()
        navigate({ to: Route.fullPath, params: { id: params.id }, search: { nodeId: node?.id } })
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
              onSaveHandler={() =>
                navigate({ to: Route.fullPath, params: { id: params.id }, replace: true })
              }
            />
          ) : (
            <NodePanel nodes={nodes} edges={edges} onSaveHandler={saveFlowHandler} />
          )}
        </TheSidebar>
      )}
    </TheFlow>
  )
}
