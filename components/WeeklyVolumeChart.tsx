'use client';

import { WeeklyVolumeData } from '@/types/workout';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface WeeklyVolumeChartProps {
  data: WeeklyVolumeData[];
}

export default function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl p-6 border border-[#333333] animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
          Weekly Volume Trend
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
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
                  backgroundColor: 'rgba(30, 30, 30, 0.95)',
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
                stroke="#22d3ee" 
                strokeWidth={3}
                fill="url(#volumeGradient)"
                dot={{ fill: '#22d3ee', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
