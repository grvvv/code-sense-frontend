import { createRouter, RouterProvider } from '@tanstack/react-router'
import './App.css'

import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
