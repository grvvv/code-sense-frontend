
import { DotsLoader } from '@/components/atomic/loader'
import ChartComponent from '@/components/charts/base'
import DonutChart from '@/components/charts/base2'
import DashboardCards from '@/components/charts/cards'
import { authService } from '@/lib/auth'
import { generalService } from '@/services/general.service'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
 
export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    authService.requireAuth();
  },
  component: Index,
})
 
function Index() {
  let { data, isLoading } = useQuery({
      queryKey: ['dashboard'],
      queryFn: () => generalService.fetchDashboard(),
    });

  if (isLoading) return <DotsLoader />

  return (
    <div className="p-2">
      <div className="h-full w-full overflow-hidden">
        <DashboardCards data={data?.top_counts} />
        <div className="grid grid-cols-2 gap-4 p-6">
          <DonutChart value={60} />
          <ChartComponent />
        </div>
      </div>
     
    </div>
  )
}
 