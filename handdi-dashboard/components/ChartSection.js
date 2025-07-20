'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

// Vibrant color palette that stands out on white background
const COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#F7B731', // Golden Yellow
  '#5F27CD', // Purple
  '#00D2D3', // Cyan
  '#FF9FF3', // Pink
  '#54A0FF', // Light Blue
  '#48DBFB', // Baby Blue
  '#FF6348', // Orange Red
  '#A29BFE', // Lavender
  '#FD79A8'  // Rose Pink
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-4 rounded-lg shadow-xl border border-gray-200"
      >
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-bold">{payload[0].value}</span>
        </p>
        <p className="text-sm text-gray-600">
          Percentage: <span className="font-bold">{payload[0].payload.percentage}%</span>
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function ChartSection({ chartData, totalAgents }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Referrer Origins</h2>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
            Total Referrals: <span className="font-bold">{totalAgents}</span>
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 shadow-md transition-all"
          >
            <Filter className="w-4 h-4" />
            Filter
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl hover:shadow-lg flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      <div className="h-96 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {chartData.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`}>
                  <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
                  <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={130}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
              label={({ percentage }) => `${percentage}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradient-${index})`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="middle" 
              align="right" 
              layout="vertical"
              wrapperStyle={{ paddingLeft: '20px' }}
              formatter={(value, entry) => (
                <span className="text-sm">
                  <span className="font-medium">{value}</span>: {entry.value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}