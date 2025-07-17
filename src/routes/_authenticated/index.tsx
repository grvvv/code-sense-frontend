
import ChartComponent from '@/components/charts/base'
import DonutChart from '@/components/charts/base2'
import DashboardCards from '@/components/charts/cards'
import { createFileRoute } from '@tanstack/react-router'
 
export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})
 
function Index() {
  return (
    <div className="p-2">
      <div className="h-full w-full overflow-hidden">
        <DashboardCards />
        <div className="grid grid-cols-2 gap-4 p-6">
          <DonutChart value={60} />
          <ChartComponent />
        </div>
      </div>
     
    </div>
  )
}
 