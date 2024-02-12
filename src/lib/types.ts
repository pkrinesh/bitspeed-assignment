import { DataSchema } from '@/lib/schema'
import type { Edge, Node } from 'reactflow'
import { z } from 'zod'

export type NodeData = z.infer<typeof DataSchema>
export type FlowNode = Node<NodeData>

export type Flow = {
  id: string
  name: string
  nodes?: FlowNode[]
  edges?: Edge[]
}
