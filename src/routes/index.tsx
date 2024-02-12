import { useFlows } from '@/lib/hooks/use-flows'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [flows] = useFlows()

  useEffect(() => {
    console.log(flows)
  }, [flows])

  return (
    <div>
      <Link to="/flow/new">Create new flow</Link>
      <ul className="flex gap-2">
        {flows?.map((flow) => {
          return (
            <li className="rounded-lg border p-4" key={flow.id}>
              <Link to="/flow/$id/edit" params={{ id: flow.id }}>
                {flow.id}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
