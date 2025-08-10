import { useScanDetails } from '@/hooks/use-scans';
import { createFileRoute, Outlet, useParams, useLocation, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/scan/$scanId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { scanId } = useParams({ from: '/_authenticated/scan/$scanId' });
  const { data: scan } = useScanDetails(scanId);
  const location = useLocation();
  
  // Determine active tab based on current pathname
  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.includes('/findings')) return 'findings';
    if (pathname.includes('/updates')) return 'updates';
    // Default to updates if no specific tab is in URL
    return 'updates';
  };

  const activeTab = getActiveTab();
  
  return (
    <div className="bg-gray-50 p-2">
      <div className="max-w-8xl mx-auto">

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <Link
              to="/scan/$scanId/updates"
              params={{ scanId }}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 text-center ${
                activeTab === 'updates'
                  ? 'bg-red-600 text-white border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Updates
            </Link>
            <Link
              to="/scan/$scanId/findings"
              params={{ scanId }}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 text-center ${
                activeTab === 'findings'
                  ? 'bg-red-600 text-white border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Findings
              {scan?.findings && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  {scan.findings}
                </span>
              )}
            </Link>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}