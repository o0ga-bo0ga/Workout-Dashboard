'use client';

import FrequencyChart from '@/components/charts/FrequencyChart';
import VolumeChart from '@/components/charts/VolumeChart';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import ChartCard from '@/components/ui/ChartCard';
import StatCard from '@/components/ui/StatCard';
import WorkoutDetail from '@/components/WorkoutDetail';
import WorkoutList from '@/components/WorkoutList';
import { DashboardStats, FrequencyDataPoint, VolumeDataPoint, Workout } from '@/types/workout';
import { Activity, Calendar, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [volumeData, setVolumeData] = useState<VolumeDataPoint[]>([]);
  const [frequencyData, setFrequencyData] = useState<FrequencyDataPoint[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, volumeRes, frequencyRes, workoutsRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/charts/volume'),
        fetch('/api/charts/frequency'),
        fetch('/api/workouts?limit=10'),
      ]);

      if (!statsRes.ok || !volumeRes.ok || !frequencyRes.ok || !workoutsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [statsData, volumeData, frequencyData, workoutsData] = await Promise.all([
        statsRes.json(),
        volumeRes.json(),
        frequencyRes.json(),
        workoutsRes.json(),
      ]);

      setStats(statsData);
      setVolumeData(volumeData);
      setFrequencyData(frequencyData);
      setWorkouts(workoutsData.workouts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkout = async (workout: Workout) => {
    try {
      // Use workout_date as the identifier since it's the primary key
      const res = await fetch(`/api/workouts/${encodeURIComponent(workout.workout_date)}`);
      if (!res.ok) throw new Error('Failed to fetch workout details');
      const data = await res.json();
      setSelectedWorkout(data);
    } catch (err) {
      console.error('Error fetching workout details:', err);
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
          <ErrorState message={error} onRetry={fetchAllData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Workout Analytics
          </h1>
          <p className="text-gray-400 text-lg">
            Track your fitness journey and performance metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            label="Last Workout"
            value={stats?.lastWorkout ? new Date(stats.lastWorkout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
          />
          <StatCard
            icon={Activity}
            label="Total Workouts (30d)"
            value={stats?.totalWorkouts || 0}
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Per Week"
            value={stats?.avgWorkoutsPerWeek || 0}
          />
          <StatCard
            icon={Target}
            label="Consistency Score"
            value={`${stats?.consistencyScore || 0}%`}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Workout Volume Over Time">
            <VolumeChart data={volumeData} />
          </ChartCard>
          <ChartCard title="Workouts Per Week">
            <FrequencyChart data={frequencyData} />
          </ChartCard>
        </div>

        {/* Workout History */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 p-[1px] animate-slide-up">
          <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-xl p-6">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Recent Workouts
            </h2>
            {workouts.length > 0 ? (
              <WorkoutList workouts={workouts} onSelectWorkout={handleSelectWorkout} />
            ) : (
              <p className="text-gray-400 text-center py-8">No workouts found</p>
            )}
          </div>
        </div>
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </div>
  );
}
