'use client';

import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 p-[1px] animate-fade-in">
      <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1">
            <label htmlFor="workout-date" className="block text-sm font-medium text-gray-400 mb-2">
              Select Workout Date
            </label>
            <input
              id="workout-date"
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
