
import { DotsLoader } from '@/components/atomic/loader'
import ChartComponent from '@/components/charts/base'
import DashboardCards from '@/components/charts/cards'
import DonutChart from '@/components/charts/donut-chart'
import { Unauthorized } from '@/components/molecule/unauthorized'
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
  let { data, isLoading, isError, error } = useQuery({
      queryKey: ['dashboard'],
      queryFn: () => generalService.fetchDashboard(),
    });

  if (isLoading) return <DotsLoader />

  if (isError) {
    return <Unauthorized variant='minimal' />
  }

  return (
    <div className="p-2">
      <div className="h-full w-full overflow-hidden">
        <DashboardCards data={data?.top_counts} />
        <div className="grid grid-cols-2 gap-4 p-6">
          <DonutChart value={data?.system_status.active_percentage} />
          <ChartComponent value={data?.findings_trend}/>
        </div>
      </div>
     
    </div>
  )
}
 