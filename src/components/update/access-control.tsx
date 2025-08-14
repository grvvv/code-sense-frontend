import { useState, useEffect } from 'react';
import { User, Shield, Save, RefreshCw, Check, X, Eye, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { usePermissions, useUpdatePermissions } from '@/hooks/use-auth';
import type { AllPermissions, PermissionRole } from '@/types/auth';
 
const AccessControlSystem = () => {
  const [selectedRole, setSelectedRole] = useState<PermissionRole>('user');
  const [localPermissions, setLocalPermissions] = useState<AllPermissions>({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showHierarchyInfo, setShowHierarchyInfo] = useState(false);
 
  // Tanstack Query hooks
  const {
    data: permissionsData,
    isLoading,
    error,
    refetch
  } = usePermissions(selectedRole)
 
  const updatePermissionsMutation = useUpdatePermissions();
 
  // Define the hierarchical workflow structure based on the provided diagram
  const permissionDependencies = {
    // View Project is the root - no prerequisites
    'view_projects': [],
   
    // Create Project requires View Project
    'create_project': ['view_projects'],
   
    // Update/Delete Project require Create Project
    'update_project': ['view_projects', 'create_project'],
    'delete_project': ['view_projects', 'create_project'],
   
    // View Scan requires View Project
    'view_scans': ['view_projects'],
   
    // Create Scan requires View Project and View Scan
    'create_scan': ['view_projects', 'view_scans'],
   
    // Update/Delete Scan require Create Scan
    'update_scan': ['view_projects', 'view_scans', 'create_scan'],
    'delete_scan': ['view_projects', 'view_scans', 'create_scan'],
   
    // View Finding requires View Scan
    'view_findings': ['view_projects', 'view_scans'],
   
    // Validate Finding (equivalent to create) requires View Finding
    'validate_finding': ['view_projects', 'view_scans', 'view_findings'],
   
    // Delete Finding requires Validate Finding
    'delete_finding': ['view_projects', 'view_scans', 'view_findings', 'validate_finding'],
   
    // View Report requires Validate Finding
    'view_reports': ['view_projects', 'view_scans', 'view_findings', 'validate_finding'],
   
    // Create Report requires View Report
    'create_report': ['view_projects', 'view_scans', 'view_findings', 'validate_finding', 'view_reports'],
   
    // Update/Delete Report require Create Report
    'update_report': ['view_projects', 'view_scans', 'view_findings', 'validate_finding', 'view_reports', 'create_report'],
    'delete_report': ['view_projects', 'view_scans', 'view_findings', 'validate_finding', 'view_reports', 'create_report']
  };
 
  // Get all prerequisite permissions for a given permission
  const getPrerequisitePermissions = (permission) => {
    return permissionDependencies[permission] || [];
  };
 
  // Get all dependent permissions that would be affected if this permission is disabled
  const getDependentPermissions = (permission) => {
    const dependents = [];
   
    // Find all permissions that depend on this permission
    Object.entries(permissionDependencies).forEach(([perm, prerequisites]) => {
      if (prerequisites.includes(permission)) {
        dependents.push(perm);
      }
    });
   
    return dependents;
  };
 
  // Apply hierarchical rules when toggling permissions
  const applyHierarchicalRules = (permission, newValue, currentPermissions) => {
    let updatedPermissions = { ...currentPermissions };
   
    if (newValue) {
      // Enabling: turn on all prerequisite permissions
      const prerequisites = getPrerequisitePermissions(permission);
      prerequisites.forEach(prereq => {
        updatedPermissions[prereq] = true;
      });
      updatedPermissions[permission] = true;
    } else {
      // Disabling: turn off all dependent permissions
      const dependents = getDependentPermissions(permission);
      dependents.forEach(dependent => {
        updatedPermissions[dependent] = false;
      });
      updatedPermissions[permission] = false;
    }
   
    return updatedPermissions;
  };
 
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
    const currentValue = localPermissions[permission] || false;
    const newValue = !currentValue;
   
    const updatedPermissions = applyHierarchicalRules(permission, newValue, localPermissions);
   
    setLocalPermissions(updatedPermissions);
   
    // Show informative message about hierarchical changes
    if (newValue) {
      const prerequisites = getPrerequisitePermissions(permission);
      if (prerequisites.length > 0) {
        setMessage(`Enabled ${formatPermissionName(permission)} and ${prerequisites.length} prerequisite permission(s)`);
        setMessageType('info');
      }
    } else {
      const dependents = getDependentPermissions(permission);
      if (dependents.length > 0) {
        setMessage(`Disabled ${formatPermissionName(permission)} and ${dependents.length} dependent permission(s)`);
        setMessageType('info');
      }
    }
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
    Projects: ['view_projects', 'create_project', 'update_project', 'delete_project'],
    Scans: ['view_scans', 'create_scan', 'update_scan', 'delete_scan'],
    Findings: ['view_findings', 'validate_finding', 'delete_finding'],
    Reports: ['view_reports', 'create_report', 'update_report', 'delete_report']
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
 
  // Check if a permission would be affected by hierarchical rules
  const getPermissionStatus = (permission) => {
    const prerequisites = getPrerequisitePermissions(permission);
    const dependents = getDependentPermissions(permission);
   
    const hasUnmetPrerequisites = prerequisites.some(prereq => !localPermissions[prereq]);
    const hasEnabledDependents = dependents.some(dependent => localPermissions[dependent]);
   
    return {
      hasUnmetPrerequisites,
      hasEnabledDependents,
      prerequisites,
      dependents
    };
  };
 
  // Toggle Button Component
  const ToggleButton = ({ enabled, onToggle, disabled = false, permission }) => {
    const status = getPermissionStatus(permission);
    const isIndirectlyControlled = status.hasUnmetPrerequisites || status.hasEnabledDependents;
   
    return (
      <div className="flex flex-col items-end">
        <button
          onClick={onToggle}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            enabled
              ? 'bg-red-600 focus:ring-red-500'
              : 'focus:ring-gray-400'
          } ${isIndirectlyControlled ? 'ring-2 ring-yellow-400' : ''}`}
          style={{
            backgroundColor: enabled ? '#BF0000' : '#2d2d2d'
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        {isIndirectlyControlled && (
          <span className="text-xs text-yellow-600 mt-1">
            {status.hasUnmetPrerequisites ? 'Needs prereqs' : 'Has dependents'}
          </span>
        )}
      </div>
    );
  };
 
  // Workflow Hierarchy Visualization based on the diagram
  const WorkflowHierarchy = () => {
    const getPermissionLevel = (permission) => {
      const prerequisites = getPrerequisitePermissions(permission);
      return prerequisites.length;
    };
 
    const permissionsByLevel = {
      0: ['view_projects'],
      1: ['create_project', 'view_scans'],
      2: ['update_project', 'delete_project', 'create_scan', 'view_findings'],
      3: ['update_scan', 'delete_scan', 'validate_finding', 'delete_finding'],
      4: ['view_reports'],
      5: ['create_report'],
      6: ['update_report', 'delete_report']
    };
 
    return (
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Permission Workflow Hierarchy (Based on Diagram)</h3>
        </div>
       
        <div className="space-y-4">
          {Object.entries(permissionsByLevel).map(([level, permissions]) => (
            <div key={level} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                {level}
              </div>
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <div
                    key={permission}
                    className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${
                      localPermissions[permission]
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {formatPermissionName(permission)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
 
        <div className="mt-4 p-3 bg-blue-100 rounded-md">
          <h4 className="font-semibold text-blue-800 text-sm mb-2">Key Relationships:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>View Project</strong> is the foundation - required for all other permissions</li>
            <li>• <strong>Create Project</strong> enables Update/Delete Project actions</li>
            <li>• <strong>View Scan</strong> branches from View Project, enables scan operations</li>
            <li>• <strong>Create Scan</strong> enables Update/Delete Scan actions</li>
            <li>• <strong>Validate Finding</strong> is required before any report operations</li>
            <li>• <strong>Create Report</strong> is the final step, enables Update/Delete Report</li>
          </ul>
        </div>
 
        <p className="text-xs text-blue-600 mt-3">
          This hierarchy ensures logical workflow progression: Projects → Scans → Findings → Reports
        </p>
      </div>
    );
  };
 
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-white p-6 rounded-t-lg" style={{ background: 'linear-gradient(135deg, #bf0000 0%, #8b0000 100%)' }}>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Hierarchical Access Control Management</h1>
              <p className="text-red-100 mt-1">Manage role-based permissions with workflow hierarchy</p>
            </div>
          </div>
        </div>
 
        {/* Role Selection */}
        <div className="p-6" style={{ borderBottom: '1px solid #e5e5e5' }}>
          <div className="flex items-center justify-between">
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
            <button
              onClick={() => setShowHierarchyInfo(!showHierarchyInfo)}
              className="px-3 py-2 rounded-md flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: '#e3f2fd',
                color: '#1565c0'
              }}
            >
              <Info className="w-4 h-4" />
              {showHierarchyInfo ? 'Hide' : 'Show'} Hierarchy
            </button>
          </div>
        </div>
 
        {/* Hierarchy Visualization */}
        {showHierarchyInfo && (
          <div className="px-6">
            <WorkflowHierarchy />
          </div>
        )}
 
        {/* Status Message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-md border flex items-center gap-2`}
               style={{
                 backgroundColor: messageType === 'success' ? '#dcfce7' : messageType === 'info' ? '#e0f2fe' : '#fef2f2',
                 color: messageType === 'success' ? '#166534' : messageType === 'info' ? '#0277bd' : '#991b1b',
                 borderColor: messageType === 'success' ? '#bbf7d0' : messageType === 'info' ? '#b3e5fc' : '#fecaca'
               }}>
            {messageType === 'error' && <AlertCircle className="w-4 h-4" />}
            {messageType === 'success' && <Check className="w-4 h-4" />}
            {messageType === 'info' && <Info className="w-4 h-4" />}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {categoryPermissions.map(permission => {
                      const status = getPermissionStatus(permission);
                      return (
                        <div key={permission} className="bg-white p-4 rounded-md border hover:shadow-md transition-shadow"
                             style={{ borderColor: '#e5e5e5' }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <div style={{ color: localPermissions[permission] ? '#BF0000' : '#2d2d2d' }}>
                                {getPermissionIcon(permission)}
                              </div>
                              <div className="flex-1">
                                <label className="text-sm font-medium block cursor-pointer" style={{ color: '#2d2d2d' }}>
                                  {formatPermissionName(permission)}
                                </label>
                                <span className="text-xs" style={{
                                  color: localPermissions[permission] ? '#BF0000' : '#6b7280'
                                }}>
                                  {localPermissions[permission] ? 'Allowed' : 'Denied'}
                                </span>
                                {status.prerequisites.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Requires: {status.prerequisites.length} prerequisite(s)
                                  </div>
                                )}
                              </div>
                            </div>
                            <ToggleButton
                              enabled={localPermissions[permission] || false}
                              onToggle={() => handlePermissionToggle(permission)}
                              disabled={isLoading}
                              permission={permission}
                            />
                          </div>
                        </div>
                      );
                    })}
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
              Allowed: <span className="font-medium text-red-600">
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
              permissions: localPermissions,
              workflow_compliance: {
                project_operations_enabled: localPermissions['view_projects'] && localPermissions['create_project'],
                scan_operations_enabled: localPermissions['view_scans'] && localPermissions['create_scan'],
                finding_operations_enabled: localPermissions['view_findings'] && localPermissions['validate_finding'],
                report_operations_enabled: localPermissions['view_reports'] && localPermissions['create_report'],
                full_workflow_enabled: localPermissions['view_projects'] &&
                                     localPermissions['view_scans'] &&
                                     localPermissions['view_findings'] &&
                                     localPermissions['validate_finding'] &&
                                     localPermissions['view_reports'] &&
                                     localPermissions['create_report']
              }
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
 
export default AccessControlSystem;
 