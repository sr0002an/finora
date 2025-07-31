// src/components/BudgetPieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658']; // Needs, Wants, Savings

const BudgetPieChart = ({ budget }) => {
  if (!budget || budget.total === 0) return null;

  const data = [
    { name: 'Needs', value: budget.needs },
    { name: 'Wants', value: budget.wants },
    { name: 'Savings', value: budget.savings },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <h3 style={{ textAlign: 'center' }}>Budget Allocation</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default BudgetPieChart;