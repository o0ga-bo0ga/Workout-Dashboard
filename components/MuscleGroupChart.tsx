'use client';

import { MuscleGroupData } from '@/types/workout';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  '#22d3ee', // cyan-400
  '#06b6d4', // cyan-500
  '#0891b2', // cyan-600
  '#0e7490', // cyan-700
  '#155e75', // cyan-800
  '#164e63', // cyan-900
];

export default function MuscleGroupChart() {
  const [data, setData] = useState<MuscleGroupData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default to last 30 days
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const defaults = getDefaultDates();
  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/charts/muscle-groups?startDate=${startDate}&endDate=${endDate}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching muscle group data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl p-6 border border-[#333333] animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
        Muscle Group Distribution
      </h2>

      {/* Date Range Picker */}
      <div className="mb-6 p-4 rounded-xl bg-[#2a2a2a]/50 border border-[#333333]">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-gray-300">Date Range</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-cyan-400/30 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-cyan-400/30 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-gray-400">No data available for this period</p>
        </div>
      ) : (
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="volume"
                nameKey="muscleGroup"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(entry: any) => `${entry.muscleGroup} (${entry.percentage}%)`}
                labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 30, 0.95)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#22d3ee' }}
                formatter={(value: any) => [`${value.toLocaleString()} kg`, 'Volume']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ color: '#9ca3af' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
