import { z } from 'zod'

export const DataSchema = z.object({
  label: z.string(),
  to: z.set(z.string()),
  from: z.set(z.string()),
})

export const NodeSchema = z.object({
  id: z.string(),
  data: DataSchema,
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
})
