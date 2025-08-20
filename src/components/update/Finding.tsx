import { AlertTriangle, Shield, FileText, Code, Bug, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

function Finding() {
  // Sample finding data - replace with your actual data source
  const finding = {
    name: "SQL Injection in User Authentication",
    severity: "High",
    description: "The application is vulnerable to SQL injection attacks in the user authentication module. User-supplied input is directly concatenated into SQL queries without proper sanitization or parameterization, allowing attackers to manipulate database queries and potentially gain unauthorized access to sensitive data.",
    mitigation: "1. Use parameterized queries or prepared statements instead of string concatenation\n2. Implement proper input validation and sanitization\n3. Apply the principle of least privilege for database connections\n4. Use stored procedures where appropriate\n5. Implement proper error handling to avoid information disclosure",
    file: "/src/auth/login.js",
    vulnerableCode: `// Vulnerable code example
const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
db.query(query, (err, results) => {
  if (results.length > 0) {
    // User authenticated
  }
});`,
    status: "Open",
    cweId: "CWE-89",
    creationDate: "2024-01-15T10:30:00Z"
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in progress':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const formatMitigation = (mitigation) => {
    return mitigation.split('\n').map((line, index) => (
      <div key={index} className="mb-2 last:mb-0">
        {line}
      </div>
    ))
  }

  return (
    <div className="p-6 bg-white overflow-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bug className="w-6 h-6 text-red-500" />
              Security Finding Details
            </h1>
            <div className="flex items-center gap-2">
              {getStatusIcon(finding.status)}
              <span className="text-sm font-medium text-gray-700">{finding.status}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Finding Name */}  
            <div className="flex justify-between">
              <div className='flex gap-3'>
                <AlertTriangle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {finding.name}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-md font-medium border ${getSeverityColor(finding.severity)}`}>
                  {finding.severity} Severity
                </span>
                <span className="text-md text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {finding.cweId}
                </span>
              </div>
            </div>

          {/* Description */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {finding.description}
            </p>
          </div>

          {/* File Information */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Affected File
            </h3>
            <code className="text-purple-800 bg-purple-100 px-2 py-1 rounded text-sm">
              {finding.file}
            </code>
          </div>

          {/* Vulnerable Code */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-red-600" />
              Vulnerable Code
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono">
                <code>{finding.vulnerableCode}</code>
              </pre>
            </div>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 mb-6">
          {/* Security Risk */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-600" />
              Security Risk
            </h3>
            <div className="text-gray-700 space-y-2">
              {formatMitigation(finding.mitigation)}
            </div>
          </div>

          {/* Mitigation */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Mitigation Steps
            </h3>
            <div className="text-gray-700 space-y-2">
              {formatMitigation(finding.mitigation)}
            </div>
          </div>
          
        </div>

        {/* Creation Date */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Creation Date</h3>
          <p className="text-gray-700">
            {new Date(finding.creationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        </div>
      </div>
    </div>
  )
}

export default Finding