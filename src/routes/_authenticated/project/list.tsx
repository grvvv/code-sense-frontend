import { Card } from '@/components/atomic/card'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/project/list')({
  component: RouteComponent,
})

interface Project {
  id: number
  name: string
  preset: string
  status: 'completed' | 'progressing' | 'failed'
  progress?: number
  createdAt: string
}

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sample data - expanded to show pagination
  const projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Dashboard',
      preset: 'React Application',
      status: 'completed',
      createdAt: '2024-12-15'
    },
    {
      id: 2,
      name: 'API Gateway Service',
      preset: 'Node.js Backend',
      status: 'progressing',
      progress: 65,
      createdAt: '2024-12-20'
    },
    {
      id: 3,
      name: 'Mobile Banking App',
      preset: 'Mobile App',
      status: 'completed',
      createdAt: '2024-12-10'
    },
    {
      id: 4,
      name: 'Data Analytics Platform',
      preset: 'Full Stack Application',
      status: 'progressing',
      progress: 32,
      createdAt: '2024-12-22'
    },
    {
      id: 5,
      name: 'Customer Support Bot',
      preset: 'REST API',
      status: 'failed',
      createdAt: '2024-12-18'
    },
    {
      id: 6,
      name: 'Inventory Management',
      preset: 'Desktop Application',
      status: 'completed',
      createdAt: '2024-12-08'
    },
    {
      id: 7,
      name: 'Social Media Scheduler',
      preset: 'React Application',
      status: 'progressing',
      progress: 78,
      createdAt: '2024-12-25'
    },
    {
      id: 8,
      name: 'Payment Gateway',
      preset: 'REST API',
      status: 'completed',
      createdAt: '2024-12-05'
    },
    {
      id: 9,
      name: 'Task Management App',
      preset: 'Full Stack Application',
      status: 'progressing',
      progress: 45,
      createdAt: '2024-12-23'
    },
    {
      id: 10,
      name: 'Blog Platform',
      preset: 'React Application',
      status: 'completed',
      createdAt: '2024-12-12'
    },
    {
      id: 11,
      name: 'Chat Application',
      preset: 'Node.js Backend',
      status: 'progressing',
      progress: 89,
      createdAt: '2024-12-26'
    },
    {
      id: 12,
      name: 'File Storage Service',
      preset: 'REST API',
      status: 'completed',
      createdAt: '2024-12-07'
    },
    {
      id: 13,
      name: 'Learning Management System',
      preset: 'Full Stack Application',
      status: 'progressing',
      progress: 23,
      createdAt: '2024-12-28'
    },
    {
      id: 14,
      name: 'Weather App',
      preset: 'Mobile App',
      status: 'failed',
      createdAt: '2024-12-14'
    },
    {
      id: 15,
      name: 'Video Streaming Platform',
      preset: 'Full Stack Application',
      status: 'progressing',
      progress: 67,
      createdAt: '2024-12-30'
    },
    {
      id: 16,
      name: 'IoT Dashboard',
      preset: 'React Application',
      status: 'completed',
      createdAt: '2024-12-03'
    },
    {
      id: 17,
      name: 'Cryptocurrency Tracker',
      preset: 'Desktop Application',
      status: 'progressing',
      progress: 54,
      createdAt: '2024-12-29'
    },
    {
      id: 18,
      name: 'Recipe Sharing App',
      preset: 'Mobile App',
      status: 'completed',
      createdAt: '2024-12-11'
    },
    {
      id: 19,
      name: 'Event Management System',
      preset: 'Full Stack Application',
      status: 'failed',
      createdAt: '2024-12-16'
    },
    {
      id: 20,
      name: 'News Aggregator',
      preset: 'React Application',
      status: 'progressing',
      progress: 91,
      createdAt: '2024-12-31'
    },
    {
      id: 21,
      name: 'Fitness Tracker',
      preset: 'Mobile App',
      status: 'completed',
      createdAt: '2024-12-04'
    },
    {
      id: 22,
      name: 'Online Marketplace',
      preset: 'Full Stack Application',
      status: 'progressing',
      progress: 38,
      createdAt: '2025-01-01'
    }
  ]

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" style={{ color: '#28a745' }} />
      case 'progressing':
        return <Clock className="w-5 h-5" style={{ color: '#284ca7' }} />
      case 'failed':
        return <AlertCircle className="w-5 h-5" style={{ color: '#dc3545' }} />
      default:
        return null
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'progressing':
        return 'In Progress'
      case 'failed':
        return 'Failed'
      default:
        return status
    }
  }

  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="h-2.5 rounded-full transition-all duration-300"
        style={{ 
          width: `${progress}%`,
          backgroundColor: '#284ca7'
        }}
      />
    </div>
  )

  return (
    <Card className='py-0 overflow-hidden'>
    <div className="p-6" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2d2d2d' }}>
            Project List
          </h1>
        </div>

        <div className="bg-white shadow-lg overflow-hidden" style={{ border: '1px solid #e5e5e5' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#2d2d2d' }}>
                    Sr No.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#2d2d2d' }}>
                    Project Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#2d2d2d' }}>
                    Preset
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#2d2d2d' }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#2d2d2d' }}>
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#2d2d2d' }}>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#e5e5e5' }}>
                {currentProjects.map((project, index) => (
                  <tr 
                    key={project.id} 
                    className="hover:bg-gray-50 transition-colors"
                    style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }}
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2d2d2d' }}>
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm" style={{ color: '#2d2d2d' }}>
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className="inline-flex items-center text-sm font-medium"
                        style={{ 
                          color: '#2d2d2d'
                        }}
                      >
                        {project.preset}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(project.status)}
                        <span 
                          className="text-sm font-medium"
                          style={{ 
                            color: project.status === 'completed' ? '#28a745' : 
                                   project.status === 'progressing' ? '#284ca7' : 
                                   '#dc3545'
                          }}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.status === 'progressing' && project.progress !== undefined ? (
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium" style={{ color: '#2d2d2d' }}>
                              {project.progress}%
                            </span>
                          </div>
                          <ProgressBar progress={project.progress} />
                        </div>
                      ) : project.status === 'completed' ? (
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium" style={{ color: '#28a745' }}>
                              100%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full"
                              style={{ 
                                width: '100%',
                                backgroundColor: '#28a745'
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-32">
                          <span className="text-xs" style={{ color: '#dc3545' }}>
                            Failed
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#2d2d2d', opacity: 0.6 }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm" style={{ color: '#2d2d2d', opacity: 0.7 }}>
            Showing {startIndex + 1} to {Math.min(endIndex, projects.length)} of {projects.length} projects
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              style={{ 
                borderColor: '#e5e5e5',
                color: '#2d2d2d',
                backgroundColor: '#ffffff'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    page === currentPage ? 'text-white' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: page === currentPage ? '#bf0000' : '#ffffff',
                    color: page === currentPage ? '#ffffff' : '#2d2d2d',
                    border: `1px solid ${page === currentPage ? '#bf0000' : '#e5e5e5'}`
                  }}
                  onMouseEnter={(e) => {
                    if (page !== currentPage) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page !== currentPage) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              style={{ 
                backgroundColor: '#bf0000',
                color: '#ffffff',
                border: '1px solid #bf0000'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = '#a00000';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = '#bf0000';
                }
              }}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </Card>
  )
}