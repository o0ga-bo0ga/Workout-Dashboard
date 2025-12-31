'use client';

import { VolumeDataPoint } from '@/types/workout';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface VolumeChartProps {
  data: VolumeDataPoint[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          stroke="#9ca3af"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}
          labelStyle={{ color: '#e5e7eb' }}
          itemStyle={{ color: '#a78bfa' }}
        />
        <Line 
          type="monotone" 
          dataKey="volume" 
          stroke="#a78bfa" 
          strokeWidth={3}
          fill="url(#volumeGradient)"
          dot={{ fill: '#a78bfa', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#8b5cf6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
