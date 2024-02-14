import { nanoid } from 'nanoid'
import { memo, useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  NodeMouseHandler,
  OnConnect,
  ReactFlowInstance,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import colors from 'tailwindcss/colors'

import type { Flow, FlowNode, NodeData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'
import 'reactflow/dist/style.css'
import { toast } from 'sonner'
import { TextNode } from './text-node'

type ChildrenProps = {
  nodes: FlowNode[]
  setNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>
  edges: Edge[]
}

const nodeTypes = {
  textMessage: TextNode,
}

export const TheFlow = memo(function TheFlow({
  flow,
  children,
  className,
  onClick,
  onNodeOrEdgeChange,
}: {
  flow?: Flow
  children?: (props: ChildrenProps) => React.ReactNode
  className?: ClassValue[]
  onClick: () => void // when clicked on canvas hide the node edit form from side panel
  onNodeOrEdgeChange: () => void // maintaining the `saved` state for navigation blocking
}) {
  const initialNodes = [
    {
      id: nanoid(),
      type: 'textMessage',
      data: {
        label: 'New text message',
        to: new Set<string>(),
        from: new Set<string>(),
      },
      position: { x: 250, y: 250 },
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(flow?.nodes ?? initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow?.edges ?? [])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const edgeUpdateSuccessful = useRef(true)

  const setToAndFromForNode = useCallback(
    ({
      source,
      target,
      type = 'add',
    }: {
      source: string | null
      target: string | null
      type?: 'add' | 'delete'
    }) => {
      /**
       * Here I am using Set() instead of `Array` to prevent duplication
       *
       * To calculate empty node (which has zero connecting nodes)
       * we are adding `to` and `from` to the node data
       * so it will be easy to calculate latter
       * to: target and from: source
       */
      setNodes((nodes) => {
        const newNode = nodes.map((node) => {
          if (node.id === source) {
            target && node.data.to[type](target)
          }
          if (node.id === target) {
            source && node.data.from[type](source)
          }
          return node
        })

        return newNode
      })
    },
    [setNodes]
  )

  const dragOverHandler = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  /**
   * When node is drop on the the flow canvas
   */
  const dropHandler = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      if (!reactFlowInstance) return
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: FlowNode = {
        id: nanoid(),
        type,
        position,
        data: {
          label: 'New text Message',
          to: new Set(),
          from: new Set(),
        },
      }
      setNodes((nds) => nds.concat(newNode))
      onNodeOrEdgeChange()
    },
    [reactFlowInstance, setNodes]
  )

  /**
   * for every edge related handlers we have to add or delete
   * `to` or `from` from the node based on the event
   */
  const edgeConnectHandler = useCallback<OnConnect>(
    (edge: Connection) => {
      const { source, target } = edge

      setEdges((eds) => {
        // checking if edge is already originated, yes then return
        const exists = eds.filter((ed) => ed.source === source).length > 0
        if (exists) {
          toast.error("Can't connect node", {
            description: 'Node can have only one source edge',
            position: 'top-center',
          })
          return eds
        }

        setToAndFromForNode({ source, target })
        onNodeOrEdgeChange()
        return addEdge(edge, eds)
      })
    },
    [setToAndFromForNode, setEdges]
  )

  const edgeDeleteHandler = useCallback(
    (edges: Edge[]) => {
      edges.map(({ source, target }) => setToAndFromForNode({ source, target, type: 'delete' }))
      onNodeOrEdgeChange()
    },
    [setToAndFromForNode]
  )

  const edgeUpdateStartHandler = useCallback(() => {
    edgeUpdateSuccessful.current = false
  }, [])

  const edgeUpdateHandler = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true
      setEdges((els) => updateEdge(oldEdge, newConnection, els))
      setToAndFromForNode({ source: oldEdge.source, target: oldEdge.target, type: 'delete' })
      setToAndFromForNode({ source: newConnection.source, target: newConnection.target })
      onNodeOrEdgeChange()
    },
    [setToAndFromForNode, setEdges]
  )

  const edgeUpdateEndHandler = useCallback(
    (_: unknown, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id))
        setToAndFromForNode({ source: edge.source, target: edge.target, type: 'delete' })
      }

      edgeUpdateSuccessful.current = true
    },
    [setToAndFromForNode, setEdges]
  )

  /**
   * we are stopPropagating event from node to canvas
   */
  const editNodeHandler: NodeMouseHandler = (e) => {
    e.stopPropagation()
  }

  return (
    <div className={cn('flex h-full overflow-hidden flex-1 flex-col md:flex-row', className)}>
      <div className="flex h-full flex-1 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onClick={onClick}
          onNodeDragStop={onNodeOrEdgeChange}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={editNodeHandler}
          onConnect={edgeConnectHandler}
          onEdgesDelete={edgeDeleteHandler}
          onEdgeUpdate={edgeUpdateHandler}
          onEdgeUpdateStart={edgeUpdateStartHandler}
          onEdgeUpdateEnd={edgeUpdateEndHandler}
          onInit={setReactFlowInstance}
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Background color={colors.gray[500]} />
        </ReactFlow>
      </div>
      {children && children({ nodes, setNodes, edges })}
    </div>
  )
})
