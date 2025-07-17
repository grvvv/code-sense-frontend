import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import UpdatePage from '@/components/update/UpdatePage';
import FindingList from '@/components/update/FindingList';
import Finding from '@/components/update/Finding';

export const Route = createFileRoute('/_authenticated/about')({
  component: About,
});

const findingsData = [
  
];

function About() {
  const [activeTab, setActiveTab] = useState('updates');


  return (
    <div className="bg-gray-50 p-2">
      <div className="max-w-8xl mx-auto">

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('updates')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'updates'
                  ? 'bg-red-600 text-white border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Updates
            </button>
            <button
              onClick={() => setActiveTab('findings')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'findings'
                  ? 'bg-red-600 text-white border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Findings
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                {findingsData.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'report'
                  ? 'bg-red-600 text-white border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Reports
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'updates' && (
              <div className="space-y-4">
                <UpdatePage />
              </div>
            )}

            {activeTab === 'findings' && (
              <div className="space-y-4">
                <FindingList />
              </div>
            )}

            {activeTab === 'report' && (
              <div className="space-y-4 ">
                <Finding />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}