import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = [
  'oklch(0.72 0.17 165)',
  'oklch(0.66 0.12 200)',
  'oklch(0.75 0.15 90)',
  'oklch(0.7 0.14 290)',
  'oklch(0.64 0.16 30)',
];

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
          fill="oklch(0.72 0.17 165)"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.008 250)", border: "1px solid oklch(1 0 0 / 0.12)", borderRadius: 8 }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DeviceStats;
