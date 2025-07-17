import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Plus, Save, Edit2 } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const [licenseKey, setLicenseKey] = useState('')
  const [showLicenseKey, setShowLicenseKey] = useState(false)
  const [isAddingKey, setIsAddingKey] = useState(false)
  const [tempLicenseKey, setTempLicenseKey] = useState('')

  // Mock user data - replace with actual data from your auth context
  const userData = {
    companyName: "Tech Solutions Inc.",
    userName: "John Doe",
    email: "john.doe@techsolutions.com",
    role: "Administrator"
  }

  const handleSaveLicenseKey = () => {
    if (tempLicenseKey.trim()) {
      setLicenseKey(tempLicenseKey)
      setIsAddingKey(false)
      setTempLicenseKey('')
    }
  }

  const handleCancelAdd = () => {
    setIsAddingKey(false)
    setTempLicenseKey('')
  }

  const maskLicenseKey = (key) => {
    if (!key) return ''
    return '*'.repeat(key.length)
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
                  <span className="text-gray-800">{userData.companyName}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">User Name</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800">{userData.userName}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800">{userData.email}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-gray-800">{userData.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* License Key Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-6 border-gray-300 border-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
            License Key Management
          </h2>
          
          <div className="space-y-4">
            {!licenseKey && !isAddingKey ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No license key configured</p>
                <button
                  onClick={() => setIsAddingKey(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add License Key
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">License Key</label>
                  <div className="relative">
                    {isAddingKey ? (
                      <input
                        type="text"
                        value={tempLicenseKey}
                        onChange={(e) => setTempLicenseKey(e.target.value)}
                        placeholder="Enter your license key"
                        className="w-full p-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center">
                        <div className="flex-1 p-3 bg-gray-50 rounded-md border border-gray-200 font-mono">
                          {showLicenseKey ? licenseKey : maskLicenseKey(licenseKey)}
                        </div>
                        <button
                          onClick={() => setShowLicenseKey(!showLicenseKey)}
                          className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                          {showLicenseKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {isAddingKey ? (
                    <>
                      <button
                        onClick={handleSaveLicenseKey}
                        disabled={!tempLicenseKey.trim()}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelAdd}
                        className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAddingKey(true)
                        setTempLicenseKey(licenseKey)
                      }}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit License Key
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}