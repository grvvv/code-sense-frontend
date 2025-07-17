import Header from '@/components/molecule/header'
import Sidebar from '@/components/molecule/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex flex-col w-full'>
        <Header />
        <div className='p-4'>
          <Outlet /> 
        </div>
        
      </div>
      
    </div>
      
  )
}
