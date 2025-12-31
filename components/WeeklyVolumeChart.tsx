'use client';

import { WeeklyVolumeData } from '@/types/workout';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface WeeklyVolumeChartProps {
  data: WeeklyVolumeData[];
}

export default function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/10 via-orange-600/10 to-orange-500/10 p-[1px] animate-slide-up">
      <div className="relative h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl p-6">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Weekly Volume Trend
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="week" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                label={{ value: 'Total Volume', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#ef4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="totalVolume" 
                stroke="#ef4444" 
                strokeWidth={3}
                fill="url(#volumeGradient)"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#f87171' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
