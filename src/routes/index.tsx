import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFlows } from '@/lib/hooks/use-flows'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from '@radix-ui/react-icons'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
  flowName: z
    .string()
    .min(3, {
      message: 'Flow name must be at least 3 characters.',
    })
    .max(19, {
      message: 'Flow name must be at most 19 characters.',
    }),
})

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [flows, setFlows] = useFlows()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      flowName: '',
    },
  })

  const submitHandler = ({ flowName }: z.infer<typeof FormSchema>) => {
    navigate({ to: '/flow/new', search: { name: flowName } })
  }

  const flowDeleteHandler = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const newFlows = flows
    newFlows?.splice(index, 1)
    setFlows(newFlows ?? [])
  }

  return (
    <div className="flex flex-1 w-full">
      <div className="px-24 w-full mt-6">
        <div className="space-y-4">
          <div className="border-b border-border py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="flex justify-between w-full max-w-lg space-x-4"
              >
                <FormField
                  control={form.control}
                  name="flowName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input autoFocus placeholder="Add new flow" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create new flow</Button>
              </form>
            </Form>
          </div>
          <ul className="grid grid-cols-4 gap-4">
            {flows && flows.length > 0 ? (
              flows.map((flow, index) => {
                return (
                  <li key={flow.id}>
                    <Card className="rounded-lg flex justify-between items-center">
                      <CardHeader>
                        <CardTitle>
                          <Link
                            to="/flow/$id/edit"
                            params={{ id: flow.id }}
                            search={{ name: flow.name }}
                          >
                            {flow.name}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardFooter className="h-0 m-0 py-0">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(e) => flowDeleteHandler(e, index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </li>
                )
              })
            ) : (
              <p className="text-muted-foreground text-sm">No items found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
