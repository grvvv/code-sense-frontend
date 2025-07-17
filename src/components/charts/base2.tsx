import { PieChart, Pie, Cell } from 'recharts';

const DonutChart = ({ value = 75 }) => {
  const total = 100;
  const data = [
    { name: 'Active', value: value },
    { name: 'Remaining', value: total - value },
  ];

  const COLORS = ['#bf0000', '#e5e5e5']; // Your brand red & light gray

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">System Status</h3>
        <p className="text-sm text-gray-600">Active scan progress</p>
      </div>

      {/* Chart Container */}
      <div className="relative flex items-center justify-center mb-6">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            cx={110}
            cy={110}
            innerRadius={65}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
        </PieChart>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">{value}%</div>
          <div className="text-xs font-medium text-gray-600 mt-1">ACTIVE</div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-sm text-gray-700">Active Scan</span>
        </div>
        <div className="text-sm font-medium text-gray-800">{value}%</div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span className="text-sm text-gray-700">Remaining</span>
        </div>
        <div className="text-sm font-medium text-gray-800">{total - value}%</div>
      </div>

    </div>
  );
};

export default DonutChart;