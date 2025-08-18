
import { DotsLoader } from '@/components/atomic/loader'
import DashboardCards from '@/components/charts/cards'
import ChartComponent from '@/components/charts/count-by-severity'
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
  let { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => generalService.fetchDashboard(),
  });

  if (isLoading) return <DotsLoader />

  if (isError) {
    return <Unauthorized variant='default' />
  }

  return (
    <div className="p-2">
      <div className="h-full w-full overflow-hidden">
        <DashboardCards data={data?.top_counts} />
        <div className="grid grid-cols-2 gap-4 p-3">
          <DonutChart data={data?.system_status} />
          <ChartComponent data={data?.count_by_severity}/>
        </div>
      </div>
     
    </div>
  )
}
 