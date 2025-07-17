import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from "@/components/atomic/sonner"
import { AuthProvider } from '@/context/api-context'

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
      
      <TanStackRouterDevtools />
    </>
  ),
})