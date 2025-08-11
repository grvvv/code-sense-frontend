import { ShieldAlert, ArrowLeft, Home, Lock, AlertTriangle } from 'lucide-react';

export const Unauthorized = ({
  title = "Access Denied",
  message = "You don't have permission to access this resource.",
  showBackButton = true,
  showHomeButton = true,
  onBack,
  onHome,
  className = "",
  variant = "default" // "default", "minimal", "card"
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = '/';
    }
  };

  // Minimal variant - just icon and text
  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-md ${className}`}
           style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
        <Lock className="w-4 h-4" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  }

  // Card variant - compact card format
  if (variant === "card") {
    return (
      <div className={`bg-white rounded-lg shadow-md border p-6 max-w-md ${className}`}
           style={{ borderColor: '#e5e5e5' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: '#fef2f2' }}>
            <ShieldAlert className="w-5 h-5" style={{ color: '#bf0000' }} />
          </div>
          <h3 className="font-semibold" style={{ color: '#2d2d2d' }}>{title}</h3>
        </div>
        <p className="text-sm mb-4" style={{ color: '#6b7280' }}>{message}</p>
        <div className="flex gap-2">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="px-3 py-2 text-sm rounded-md border hover:opacity-80 transition-opacity flex items-center gap-1"
              style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff', color: '#2d2d2d' }}
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
          )}
          {showHomeButton && (
            <button
              onClick={handleHome}
              className="px-3 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-1"
              style={{ backgroundColor: '#bf0000' }}
            >
              <Home className="w-3 h-3" />
              Home
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant - full page layout
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${className}`}>
      <div className="text-center max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
               style={{ backgroundColor: '#fef2f2' }}>
            <ShieldAlert className="w-8 h-8" style={{ color: '#bf0000' }} />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#2d2d2d' }}>
            {title}
          </h1>
          <p className="mb-6" style={{ color: '#6b7280' }}>
            {message}
          </p>

          {/* Error Code */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-6"
               style={{ backgroundColor: '#e5e5e5', color: '#2d2d2d' }}>
            <AlertTriangle className="w-4 h-4" />
            Error 403 - Forbidden
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-md border font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                style={{ 
                  borderColor: '#e5e5e5',
                  backgroundColor: '#ffffff',
                  color: '#2d2d2d'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            )}
            {showHomeButton && (
              <button
                onClick={handleHome}
                className="px-6 py-3 text-white rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: '#bf0000' }}
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-sm" style={{ color: '#6b7280' }}>
          <p>If you believe this is an error, please contact your administrator.</p>
          <p className="mt-1">
            Need help? <a href="/support" className="font-medium hover:underline" style={{ color: '#bf0000' }}>
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
