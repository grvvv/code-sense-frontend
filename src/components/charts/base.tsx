import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, type TooltipProps,
} from 'recharts';

// Type definitions
interface FindingData {
  date: string;
  high: number;
  medium: number;
  low: number;
}

interface ChartData extends FindingData {
  displayDate: string;
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

// Props interface
interface ChartComponentProps {
  value?: FindingData[];
}

// Function to format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

// Transform API data for chart display
const transformDataForChart = (apiData: FindingData[]): ChartData[] => {
  return apiData.map(item => ({
    ...item,
    displayDate: formatDate(item.date)
  }));
};

// Custom tooltip component
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-gray-800 font-medium mb-2">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartComponent: React.FC<ChartComponentProps> = ({ value = [] }) => {
  // Use the prop data, fallback to empty array if not provided
  const findingsTrend = value;
  // Transform the API data for display
  const chartData = transformDataForChart(findingsTrend);
  
  // Calculate totals for stats from the latest data point
  const latestData = findingsTrend[findingsTrend.length - 1];
  const totalIssues = latestData ? latestData.high + latestData.medium + latestData.low : 0;

  // Handle empty data case
  if (!findingsTrend || findingsTrend.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Security Findings Trend</h2>
            <p className="text-sm text-gray-500">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Security Findings Trend</h2>
          <p className="text-sm text-gray-600">
            Total Issues (Latest): <span className="font-medium text-red-600">{totalIssues}</span>
          </p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="px-6 pb-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="displayDate" 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="high" stackId="a" fill="#bf0000" radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" stackId="a" fill="#bf0000" fillOpacity={0.7} radius={[0, 0, 0, 0]} />
              <Bar dataKey="low" stackId="a" fill="#bf0000" fillOpacity={0.4} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend & Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="flex justify-between items-center">
          {/* Legend */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span className="text-sm text-gray-700 font-medium">High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 opacity-70 rounded"></div>
              <span className="text-sm text-gray-700 font-medium">Medium Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-600 opacity-40 rounded"></div>
              <span className="text-sm text-gray-700 font-medium">Low Priority</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChartComponent;