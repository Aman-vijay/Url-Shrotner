import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d'];

const DeviceStats = ({ stats }) => {
  const deviceCounts = stats.reduce((acc, item) => {
    const device = item.deviceType || 'Unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(deviceCounts).map(([device, count]) => ({
    name: device,
    value: count
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DeviceStats;
