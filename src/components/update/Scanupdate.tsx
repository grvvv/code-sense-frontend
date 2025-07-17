import { useState, useEffect } from 'react';

function Scanupdate() {
  const [percentage, setPercentage] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initializing');
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    { name: 'Initializing', start: 0, end: 15 },
    { name: 'Scanning System', start: 15, end: 40 },
    { name: 'Analyzing Vulnerabilities', start: 40, end: 70 },
    { name: 'Generating Report', start: 70, end: 90 },
    { name: 'Finalizing Results', start: 90, end: 100 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        
        // Update current phase based on percentage
        const newPercentage = prev + Math.random() * 2; // Variable speed
        const currentPhaseData = phases.find(phase => 
          newPercentage >= phase.start && newPercentage < phase.end
        );
        
        if (currentPhaseData && currentPhaseData.name !== currentPhase) {
          setCurrentPhase(currentPhaseData.name);
        }
        
        return Math.min(newPercentage, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [currentPhase]);

  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
      <div className="w-full text-center">
          {/* Circular Progress */}
          <div className="relative">
            <svg className="w-48 h-48 mx-auto transform -rotate-90" viewBox="0 0 200 200">
              {/* Background Circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#e5e5e5"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#bf0000"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out"
              />
              {/* Animated Dots */}
              <circle cx="100" cy="10" r="3" fill="#bf0000" className="animate-pulse">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 100 100;360 100 100"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            
            {/* Percentage Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-1">
                  {Math.round(percentage)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>
      </div>
  );
}

export default Scanupdate;