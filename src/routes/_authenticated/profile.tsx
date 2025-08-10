import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { formatTimestamp } from '@/utils/timestampFormater'
import { Card } from '@/components/atomic/card'
import { DotsLoader } from '@/components/atomic/loader'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, isLoading, error } = useAuth()

  if (isLoading) return <DotsLoader />

  if (error) {
    return (
      <Card className="py-0 overflow-hidden">
        <div className="p-6" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="flex justify-center items-center py-8">
            <div className="text-red-600">Error: {error.message}</div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
        
        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-l-6 border-gray-300 border-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
            User Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Company Name</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800 capitalize">{user?.company}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">User Name</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800 capitalize">{user?.name}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800">{user?.email}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Created At</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800">{formatTimestamp(user?.created_at)}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Last Updated</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800 capitalize">{formatTimestamp(user?.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}