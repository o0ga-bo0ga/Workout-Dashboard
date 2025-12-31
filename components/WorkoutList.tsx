'use client';

import { Workout } from '@/types/workout';
import { Calendar, Dumbbell } from 'lucide-react';

interface WorkoutListProps {
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
}

export default function WorkoutList({ workouts, onSelectWorkout }: WorkoutListProps) {
  return (
    <div className="space-y-3">
      {workouts.map((workout, index) => (
        <div
          key={workout.workout_date}
          onClick={() => onSelectWorkout(workout)}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/30 via-gray-800/30 to-gray-800/30 p-[1px] cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-red-500/10"
        >
          <div className="relative rounded-xl bg-gray-900/80 backdrop-blur-sm p-4">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-800/50 via-gray-800/50 to-gray-800/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${workout.is_rest_day ? 'bg-gray-700/50' : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'}`}>
                  {workout.is_rest_day ? (
                    <Calendar className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Dumbbell className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-100 group-hover:text-purple-400 transition-colors">
                    {workout.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {new Date(workout.workout_date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {!workout.is_rest_day && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Volume</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {workout.total_volume.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
