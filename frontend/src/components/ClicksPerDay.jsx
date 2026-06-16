import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ClicksPerDay = ({ clicksPerDay }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={clicksPerDay} margin={{ top: 8 }} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.1)" />
        <XAxis dataKey="date" stroke="oklch(0.7 0.01 250)" />
        <YAxis stroke="oklch(0.7 0.01 250)" />
        <Tooltip contentStyle={{ backgroundColor: "oklch(0.17 0.008 250)", border: "1px solid oklch(1 0 0 / 0.12)", borderRadius: 8 }} />
        <Line type="monotone" dataKey="count" stroke="oklch(0.72 0.17 165)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ClicksPerDay;
