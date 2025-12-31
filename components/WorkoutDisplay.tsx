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
      <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl p-8 border border-[#333333] animate-pulse">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!workout || workout.total_volume === null) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl p-8 border border-[#333333] animate-fade-in">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-[#2a2a2a]/50 mb-4">
            <Calendar className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">Rest Day</h3>
          <p className="text-gray-500">No workout scheduled for this date</p>
        </div>
      </div>
    );
  }

  // Handle description - could be string or object
  const renderDescription = () => {
    if (!workout.description) {
      return <p className="text-gray-400">No exercises recorded</p>;
    }

    // If description is a string, display as-is
    if (typeof workout.description === 'string') {
      return (
        <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm leading-relaxed">
          {workout.description}
        </pre>
      );
    }

    // If description is an object (JSON with exercise names), display as beautiful cards
    try {
      const exercises = typeof workout.description === 'object' 
        ? workout.description 
        : JSON.parse(workout.description);
      
      return (
        <div className="space-y-6">
          {Object.entries(exercises).map(([exerciseName, details]: [string, any], index) => {
            // Parse the exercise details
            let sets = [];
            if (Array.isArray(details)) {
              sets = details;
            } else if (typeof details === 'object') {
              // Handle object format
              sets = Object.values(details);
            }

            return (
              <div key={index} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] p-6 border border-[#333333] hover:border-cyan-400/30 transition-all duration-300">
                {/* Exercise Name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <h5 className="text-lg font-bold text-gray-100">{exerciseName}</h5>
                </div>

                {/* Sets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sets.map((set: any, setIndex: number) => {
                    // Parse set data
                    let reps = set.reps || set['reps"'] || 'N/A';
                    let weight = set.weight_kg || set['weight_kg"'] || set.weight || 'N/A';
                    
                    return (
                      <div key={setIndex} className="relative p-4 rounded-lg bg-[#1a1a1a]/50 border border-[#2a2a2a]">
                        <div className="text-xs text-gray-500 mb-2">Set {setIndex + 1}</div>
                        <div className="flex items-baseline gap-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-cyan-400">{reps}</span>
                            <span className="text-xs text-gray-400">reps</span>
                          </div>
                          <div className="text-gray-600">×</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-300">{weight}</span>
                            <span className="text-xs text-gray-400">kg</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Sets Badge */}
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                  <span className="text-xs font-medium text-cyan-400">{sets.length} sets</span>
                </div>
              </div>
            );
          })}
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
    <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a]/90 backdrop-blur-xl p-8 border border-[#333333] animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-500/20">
            <Dumbbell className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
              {workout.title}
            </h3>
            <p className="text-gray-400 mt-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-400/10 to-cyan-500/10">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <p className="text-sm text-gray-400">Total Volume</p>
            </div>
            <p className="text-3xl font-bold text-cyan-400">
              {workout.total_volume.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 rounded-xl bg-[#2a2a2a]/50">
          <h4 className="text-lg font-semibold text-gray-200 mb-4">Exercises</h4>
          {renderDescription()}
        </div>
      </div>
    );
  }
