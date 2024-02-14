import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { ReactNode, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

/**
 * By utilizing this we can create many different node
 */
export const RootNode = memo(function RootNode({ children }: { children: ReactNode }) {
  return (
    <Card className="rounded-lg overflow-hidden">
      <CardHeader className="bg-muted px-4 py-2">
        <CardTitle className="flex justify-between items-center ">
          Send Message
          <span>
            <ChatBubbleIcon />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center px-4 py-4">
        <div className="w-full text-pretty overflow-hidden">{children}</div>
      </CardContent>
    </Card>
  )
})
