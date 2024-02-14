import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import bitSpeed from '@/components/bitspeed.svg'

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="flex h-16 items-center px-24">
          <Link to="/">
            <img src={bitSpeed} className="w-[80%]" alt="BitSpeed brand logo" />
          </Link>
        </div>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
})
