import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

import { NodeEditForm } from '@/components/node-edit-form'
import { NodePanel } from '@/components/node-panel'
import { TheFlow } from '@/components/the-flow'
import { TheSidebar } from '@/components/the-sidebar'
import { useFlows } from '@/lib/hooks/use-flows'
import { useKeyPress } from '@/lib/hooks/use-key-press'
import { Flow } from '@/lib/types'
import { nanoid } from 'nanoid'
import { useReducer, useState } from 'react'

export const Route = createFileRoute('/flow/new')({
  component: NewFlow,
  validateSearch: (search) =>
    z
      .object({
        name: z.string(),
        nodeId: z.string().optional(),
        nodeValue: z.string().optional(),
      })
      .parse(search),
})

/*
 * Here this `NewFlow` and `EditFlow` are the similar component and there are duplications
 * which is deliberated because of maintainability and also better typescript support
 * for cases like this code duplication helps in the letter stage.
 *
 * Even if we create a common component we still have to maintain the state and events separably
 */
function NewFlow() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = useSearch({ from: Route.fullPath })
  const [, setFlows] = useFlows()

  const [saved, setSaved] = useState(true)
  const [open, toggleOpen] = useReducer((prev) => !prev, false)

  /**
   * on `escape` pressed, it will come back to main-panel from node-edit-panel
   * this is necessary for accessibility and better ux
   */
  useKeyPress('Escape', () => {
    if (search.nodeId) {
      navigate({ search: ({ nodeId, nodeValue, ...rest }) => ({ ...rest }), replace: true })
    }
  })

  const saveFlowHandler = ({
    nodes,
    edges,
    justSaving,
  }: Pick<Flow, 'edges' | 'nodes'> & { justSaving?: boolean }) => {
    /**
     * storing data to the local storage as of now, can be stored anywhere
     * just have to modified the code from the `useFlow` hooks
     */
    const newFlow = {
      id: nanoid(),
      name: search.name ?? 'New Flow',
      nodes: nodes,
      edges: edges,
    }

    setFlows((prev) => {
      return [...(prev ?? []), newFlow]
    })

    /**
     * Not navigating back to the home page when user save the flow
     * instead navigating to the edit page so they can keep working
     * this is good practice coz letter we can implement autosave
     */
    if (justSaving) {
      navigate({
        to: '/flow/$id/edit',
        search: { name: newFlow.name },
        params: { id: newFlow.id },
      })
    }
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
    <>
      <TheFlow
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
                  navigate({
                    search: ({ nodeId, nodeValue, ...rest }) => ({ ...rest }),
                    replace: true,
                  })
                  setSaved(false)
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
    </>
  )
}
