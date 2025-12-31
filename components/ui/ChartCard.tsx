import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 p-[1px] animate-slide-up">
      <div className="relative h-full rounded-2xl bg-gray-900/90 backdrop-blur-xl p-6">
        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="w-full h-[300px]">
          {children}
        </div>
      </div>
    </div>
  );
}
