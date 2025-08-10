import { useState, useEffect } from 'react';
import { User, Shield, Save, RefreshCw, Check, X, Eye, AlertCircle } from 'lucide-react';
import { usePermissions, useUpdatePermissions } from '@/hooks/use-auth';
import type { AllPermissions, PermissionRole } from '@/types/auth';

const AccessControlSystem = () => {
  const [selectedRole, setSelectedRole] = useState<PermissionRole>('user');
  const [localPermissions, setLocalPermissions] = useState<AllPermissions>({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // Tanstack Query hooks
  const { 
    data: permissionsData, 
    isLoading, 
    error,
    refetch 
  } = usePermissions(selectedRole)

  const updatePermissionsMutation = useUpdatePermissions();

  // Sync local state with fetched data
  useEffect(() => {
    if (permissionsData?.permissions) {
      setLocalPermissions(permissionsData.permissions);
    }
  }, [permissionsData]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handlePermissionToggle = (permission) => {
    setLocalPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleUpdatePermissions = () => {
    updatePermissionsMutation.mutateAsync({
      role: selectedRole,
      permissions: localPermissions
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const roles = ['manager', 'user'];

  const permissionCategories = {
    Projects: ['create_project', 'delete_project', 'update_project', 'view_projects'],
    Scans: ['view_scans', 'create_scan', 'update_scan', 'delete_scan'],
    Findings: ['view_findings', 'validate_finding', 'delete_finding'],
    Reports: ['create_report', 'update_report', 'delete_report', 'view_reports']
  };

  const formatPermissionName = (permission) => {
    return permission
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPermissionIcon = (permission) => {
    if (permission.includes('view')) return <Eye className="w-4 h-4" />;
    if (permission.includes('delete')) return <X className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  // Toggle Button Component
  const ToggleButton = ({ enabled, onToggle, disabled = false }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled 
          ? 'bg-green-600 focus:ring-green-500' 
          : 'focus:ring-gray-400'
      }`}
      style={{
        backgroundColor: enabled ? '#10b981' : '#2d2d2d'
      }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-white p-6 rounded-t-lg" style={{ background: 'linear-gradient(135deg, #bf0000 0%, #8b0000 100%)' }}>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Access Control Management</h1>
              <p className="text-red-100 mt-1">Manage role-based permissions</p>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="p-6" style={{ borderBottom: '1px solid #e5e5e5' }}>
          <div className="flex items-center gap-4">
            <User className="w-5 h-5" style={{ color: '#2d2d2d' }} />
            <label className="text-sm font-medium" style={{ color: '#2d2d2d' }}>Select Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                borderColor: '#e5e5e5',
                backgroundColor: '#ffffff',
                color: '#2d2d2d',
                focusRingColor: '#bf0000'
              }}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="ml-2 px-3 py-2 rounded-md hover:opacity-80 disabled:opacity-50 flex items-center gap-2 transition-opacity"
              style={{ 
                backgroundColor: '#e5e5e5',
                color: '#2d2d2d'
              }}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-md border flex items-center gap-2`}
               style={{
                 backgroundColor: messageType === 'success' ? '#dcfce7' : '#fef2f2',
                 color: messageType === 'success' ? '#166534' : '#991b1b',
                 borderColor: messageType === 'success' ? '#bbf7d0' : '#fecaca'
               }}>
            {messageType === 'error' && <AlertCircle className="w-4 h-4" />}
            {messageType === 'success' && <Check className="w-4 h-4" />}
            {message}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-md border flex items-center gap-2"
               style={{
                 backgroundColor: '#fef2f2',
                 color: '#991b1b',
                 borderColor: '#fecaca'
               }}>
            <AlertCircle className="w-4 h-4" />
            Error loading permissions: {error.message}
          </div>
        )}

        {/* Permissions Grid */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" style={{ color: '#bf0000' }} />
              <span className="ml-2" style={{ color: '#2d2d2d' }}>Loading permissions...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                <div key={category} className="rounded-lg p-4" style={{ backgroundColor: '#e5e5e5' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#2d2d2d' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#bf0000' }}></div>
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryPermissions.map(permission => (
                      <div key={permission} className="bg-white p-4 rounded-md border hover:shadow-md transition-shadow"
                           style={{ borderColor: '#e5e5e5' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div style={{ color: localPermissions[permission] ? '#10b981' : '#2d2d2d' }}>
                              {getPermissionIcon(permission)}
                            </div>
                            <div>
                              <label className="text-sm font-medium block cursor-pointer" style={{ color: '#2d2d2d' }}>
                                {formatPermissionName(permission)}
                              </label>
                              <span className="text-xs" style={{ 
                                color: localPermissions[permission] ? '#10b981' : '#6b7280' 
                              }}>
                                {localPermissions[permission] ? 'Allowed' : 'Denied'}
                              </span>
                            </div>
                          </div>
                          <ToggleButton
                            enabled={localPermissions[permission] || false}
                            onToggle={() => handlePermissionToggle(permission)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 rounded-b-lg border-t" style={{ backgroundColor: '#e5e5e5', borderColor: '#e5e5e5' }}>
          <div className="flex justify-between items-center">
            <div className="text-sm" style={{ color: '#2d2d2d' }}>
              Role: <span className="font-medium">{selectedRole}</span> | 
              Permissions: <span className="font-medium">{Object.keys(localPermissions).length}</span> |
              Allowed: <span className="font-medium text-green-600">
                {Object.values(localPermissions).filter(Boolean).length}
              </span>
            </div>
            <button
              onClick={handleUpdatePermissions}
              disabled={updatePermissionsMutation.isPending || isLoading}
              className="px-6 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity"
              style={{ backgroundColor: '#bf0000' }}
            >
              {updatePermissionsMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {updatePermissionsMutation.isPending ? 'Updating...' : 'Update Permissions'}
            </button>
          </div>
        </div>
      </div>

      {/* Permission Summary */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2d2d2d' }}>Current Configuration</h3>
        <div className="p-4 rounded-md" style={{ backgroundColor: '#e5e5e5' }}>
          <pre className="text-sm whitespace-pre-wrap" style={{ color: '#2d2d2d' }}>
            {JSON.stringify({
              role: selectedRole,
              permissions: localPermissions
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AccessControlSystem;