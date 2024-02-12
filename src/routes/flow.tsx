import { ReactFlowProvider } from 'reactflow'

import { Outlet, createFileRoute } from '@tanstack/react-router'
import 'reactflow/dist/style.css'

export const Route = createFileRoute('/flow')({
  component: Index,

  loader: async ({ location, navigate }) => {
    if (['/flow', '/flow/'].includes(location.pathname)) {
      return navigate({ to: '/flow/new' })
    }
    return null
  },
})

function Index() {
  return (
    <ReactFlowProvider>
      <Outlet />
    </ReactFlowProvider>
  )
}

/**
 * [x] - index, new, :flow-id?edit
 * [ ] - Main page for all flows and add a create button to create new flow
 * [ ] - Create a base node - api inspired by radix
 * [x] - Sidebar - extensible for different typeof node
 * [x] - Sidebar - for action or anything with autofocus when clicked on edit button.
 * [ ] - Store state into query params.
 * [ ] - Better design
 * [ ] - Error handling
 * [x] - on ESC remove editNode
 *
 * 1. **Text Node**
 *  [x] - 1. Our flow builder currently supports only one type of message (i.e Text Message).
 *  [x] - 2. There can be multiple Text Nodes in one flow.
 *  [x] - 3. Nodes are added to the flow by dragging and dropping a Node from the Nodes Panel.
 * 2. **Nodes Panel**
 *  [x] - 1. This panel houses all kind of Nodes that our Flow Builder supports.
 *  [x] - 2. Right now there is only Message Node, but we’d be adding more types of Nodes in the future so make this section extensible
 * 3. **Edge**
 *  [x] - 1. Connects two Nodes together
 * 4. **Source Handle**
 *  [x] - 1. Source of a connecting edge
 *  [x] - 2. Can only have **one edge** originating from a source handle
 * 5. **Target Handle**
 *  [x] - 1. Target of a connecting edge
 *  [x] - 2. Can have **more than one edge** connecting to a target handle
 * 6. **Settings Panel**
 *  [x] - 1. Settings Panel will replace the Nodes Panel when a Node is selected
 *  [x] - 2. It has a text field to edit text of the selected Text Node
 * 7. **Save Button**
 *  [x] - 1. Button to save the flow
 *  [x] - 2. **Save button press will show an error if there are more than one Nodes and more than one Node has empty target handles**
 */
