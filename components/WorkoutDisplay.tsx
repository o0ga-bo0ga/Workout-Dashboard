'use client';

import { Workout } from '@/types/workout';
import { Calendar, Dumbbell, TrendingUp } from 'lucide-react';

interface WorkoutDisplayProps {
  workout: Workout | null;
  isLoading: boolean;
}

export default function WorkoutDisplay({ workout, isLoading }: WorkoutDisplayProps) {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/10 via-orange-600/10 to-orange-500/10 p-[1px] animate-pulse">
        <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-xl p-8">
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-500/10 via-gray-600/10 to-gray-700/10 p-[1px] animate-fade-in">
        <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-xl p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-gray-800/50 mb-4">
              <Calendar className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Rest Day</h3>
            <p className="text-gray-500">No workout scheduled for this date</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle description - could be string or object
  const renderDescription = () => {
    if (!workout.description) {
      return <p className="text-gray-400">No description available</p>;
    }

    // If description is a string, display as-is
    if (typeof workout.description === 'string') {
      return (
        <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm leading-relaxed">
          {workout.description}
        </pre>
      );
    }

    // If description is an object (JSON with exercise names), display as list
    try {
      const exercises = typeof workout.description === 'object' 
        ? workout.description 
        : JSON.parse(workout.description);
      
      return (
        <div className="space-y-3">
          {Object.entries(exercises).map(([exerciseName, details], index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-900/50">
              <h5 className="font-semibold text-red-500 mb-1">{exerciseName}</h5>
              <p className="text-sm text-gray-400">
                {typeof details === 'string' ? details : JSON.stringify(details)}
              </p>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return (
        <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm leading-relaxed">
          {JSON.stringify(workout.description, null, 2)}
        </pre>
      );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/10 via-orange-600/10 to-orange-500/10 p-[1px] animate-fade-in">
      <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-600/20">
            <Dumbbell className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {workout.title}
            </h3>
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

        {/* Volume Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-600/10 to-orange-600/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <p className="text-sm text-gray-400">Total Volume</p>
            </div>
            <p className="text-3xl font-bold text-red-500">
              {workout.total_volume.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h4 className="text-lg font-semibold text-gray-200 mb-3">Exercises</h4>
          {renderDescription()}
        </div>
      </div>
    </div>
  );
}
