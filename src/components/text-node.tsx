import { NodeData } from '@/lib/types'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { memo } from 'react'
import { Handle, NodeProps, Position, useNodeId } from 'reactflow'
import { RootNode } from './root-node'

export const TextNode = memo(function TextNode({
  data,
  isConnectable,
  selected,
}: NodeProps<NodeData>) {
  const nodeId = useNodeId()
  const route = useRouterState()
  const navigate = useNavigate()

  const mouseDownHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    /**
     * setting `nodeId` and `nodeValue` as query-param
     */
    navigate({
      to: route.location.pathname,
      search: (prev) => ({ ...prev, nodeId, nodeValue: data.label }),
    })
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
      <div className={clsx('w-60', selected && 'ring-1 ring-ring')}>
        <RootNode>
          <p className="nodrag cursor-text" onMouseDown={mouseDownHandler}>
            {data.label}
          </p>
        </RootNode>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  )
})
