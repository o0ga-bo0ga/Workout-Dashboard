'use client';

import { Workout } from '@/types/workout';
import { Calendar, Dumbbell, TrendingUp, X } from 'lucide-react';

interface WorkoutDetailProps {
  workout: Workout;
  onClose: () => void;
}

export default function WorkoutDetail({ workout, onClose }: WorkoutDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-gray-800/50 via-gray-800/50 to-gray-800/50 p-[1px] animate-slide-up">
        <div className="relative rounded-2xl bg-gray-900 p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-[#2a2a2a]/50 hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-3 rounded-xl ${workout.is_rest_day ? 'bg-[#2a2a2a]/50' : 'bg-gradient-to-br from-cyan-400/20 to-orange-500/20'}`}>
                {workout.is_rest_day ? (
                  <Calendar className="w-6 h-6 text-gray-400" />
                ) : (
                  <Dumbbell className="w-6 h-6 text-purple-400" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {workout.title}
                </h2>
                <p className="text-gray-400">
                  {new Date(workout.workout_date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          {!workout.is_rest_day && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-blue-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <p className="text-sm text-gray-400">Total Volume</p>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {workout.total_volume.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <p className="text-sm text-gray-400">Workout ID</p>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  #{workout.id}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-4 rounded-xl bg-[#2a2a2a]/50">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Exercise Summary</h3>
            <div className="prose prose-invert prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                {workout.description || 'No description available'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
