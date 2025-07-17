import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const openData = [
  { date: 'Jun 1', high: 200, medium: 150, low: 50 },
  { date: 'Jun 2', high: 180, medium: 120, low: 60 },
  { date: 'Jun 3', high: 220, medium: 160, low: 70 },
  { date: 'Jun 4', high: 190, medium: 140, low: 55 },
  { date: 'Jun 5', high: 210, medium: 170, low: 65 },
  { date: 'Jun 6', high: 185, medium: 135, low: 45 },
  { date: 'Jun 7', high: 205, medium: 155, low: 75 },
];

const closeData = [
  { date: 'Jun 1', high: 150, medium: 130, low: 90 },
  { date: 'Jun 2', high: 160, medium: 100, low: 80 },
  { date: 'Jun 3', high: 140, medium: 120, low: 60 },
  { date: 'Jun 4', high: 155, medium: 125, low: 85 },
  { date: 'Jun 5', high: 165, medium: 115, low: 75 },
  { date: 'Jun 6', high: 145, medium: 110, low: 70 },
  { date: 'Jun 7', high: 170, medium: 135, low: 95 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
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

const ChartComponent = () => {
  const [view, setView] = useState('open');
  const data = view === 'open' ? openData : closeData;

  // Calculate totals for stats
  const currentData = data[data.length - 1];
  const totalIssues = currentData.high + currentData.medium + currentData.low;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

      {/* Toggle Buttons */}
      
      <div className="p-6 pb-4">
        <div className="flex justify-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
          <button
            onClick={() => setView('open')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              view === 'open' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setView('close')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              view === 'close' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="px-6 pb-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
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

          {/* Action Button */}
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;