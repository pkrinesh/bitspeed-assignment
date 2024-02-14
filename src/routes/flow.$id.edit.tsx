import { NodeEditForm } from '@/components/node-edit-form'
import { NodePanel } from '@/components/node-panel'
import { TheFlow } from '@/components/the-flow'
import { TheSidebar } from '@/components/the-sidebar'
import { useFlows } from '@/lib/hooks/use-flows'
import { useKeyPress } from '@/lib/hooks/use-key-press'
import { Flow } from '@/lib/types'
import { createFileRoute, useBlocker, useNavigate } from '@tanstack/react-router'
import { useMemo, useReducer, useState } from 'react'
import 'reactflow/dist/style.css'
import { z } from 'zod'

export const Route = createFileRoute('/flow/$id/edit')({
  component: EditFlow,
  validateSearch: (search) =>
    z
      .object({
        name: z.string(),
        nodeId: z.string().optional(),
        nodeValue: z.string().optional(),
      })
      .parse(search),
})

function EditFlow() {
  const navigate = useNavigate({ from: Route.fullPath })
  const params = Route.useParams()
  const search = Route.useSearch()

  const [flows, setFlows] = useFlows()
  const flow = useMemo(() => flows?.find((flow) => flow.id === params.id), [params, flows])

  const [saved, setSaved] = useState(true)
  const [open, toggleOpen] = useReducer((prev) => !prev, false)

  useBlocker(() => toggleOpen(), !saved)

  /**
   * on escape pressed it will come back to main-panel from node-edit-panel
   * this is necessary for accessibility and better ux
   */
  useKeyPress('Escape', () => {
    if (search.nodeId) {
      navigate({ search: ({ nodeId, nodeValue, ...rest }) => ({ ...rest }), replace: true })
    }
  })

  const saveFlowHandler = (data: Pick<Flow, 'edges' | 'nodes'>) => {
    setSaved(true)
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
  }

  return (
    <TheFlow
      flow={flow}
      onNodeOrEdgeChange={() => setSaved(false)}
      onClick={() => {
        if (search.nodeId) {
          navigate({
            search: ({ nodeId, nodeValue, ...rest }) => ({ ...rest }),
            replace: true,
          })
        }
      }}
    >
      {({ nodes, edges, setNodes }) => (
        <TheSidebar>
          {search.nodeId ? (
            <NodeEditForm
              nodes={nodes}
              onSetNodes={setNodes}
              nodeId={search.nodeId}
              onSaveHandler={() => {
                setSaved(false)
                navigate({
                  search: ({ nodeId, nodeValue, ...rest }) => ({ ...rest }),
                  replace: true,
                })
              }}
            />
          ) : (
            <NodePanel
              nodes={nodes}
              edges={edges}
              onSaveHandler={saveFlowHandler}
              saved={saved}
              onSaved={setSaved}
              open={open}
              onToggleOpen={toggleOpen}
            />
          )}
        </TheSidebar>
      )}
    </TheFlow>
  )
}
