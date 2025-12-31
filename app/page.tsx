'use client';

import DateSelector from '@/components/DateSelector';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import WeeklyVolumeChart from '@/components/WeeklyVolumeChart';
import WorkoutDisplay from '@/components/WorkoutDisplay';
import { WeeklyVolumeData, Workout } from '@/types/workout';
import { useEffect, useState } from 'react';

export default function Home() {
  const [weeklyData, setWeeklyData] = useState<WeeklyVolumeData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weekly volume data on mount
  useEffect(() => {
    fetchWeeklyData();
  }, []);

  // Fetch workout when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchWorkoutByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/charts/volume');
      if (!res.ok) throw new Error('Failed to fetch weekly data');

      const data = await res.json();
      setWeeklyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutByDate = async (date: string) => {
    try {
      setWorkoutLoading(true);

      const res = await fetch(`/api/workouts/by-date?date=${date}`);
      if (!res.ok) throw new Error('Failed to fetch workout');

      const data = await res.json();
      setSelectedWorkout(data);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setSelectedWorkout(null);
    } finally {
      setWorkoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} onRetry={fetchWeeklyData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-orange-400 bg-clip-text text-transparent">
            Workout Analytics
          </h1>
          <p className="text-gray-600 text-lg">
            Track your training volume and progress
          </p>
        </div>

        {/* Weekly Volume Chart */}
        <WeeklyVolumeChart data={weeklyData} />

        {/* Date Selector */}
        <DateSelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Workout Display */}
        <WorkoutDisplay 
          workout={selectedWorkout}
          isLoading={workoutLoading}
        />
      </div>
    </div>
  );
}
