import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/workout';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get last workout
    const { data: lastWorkoutData, error: lastWorkoutError } = await supabase
      .from('workouts')
      .select('workout_date, title, total_volume')
      .eq('is_rest_day', false)
      .order('workout_date', { ascending: false })
      .limit(1)
      .single();

    if (lastWorkoutError && lastWorkoutError.code !== 'PGRST116') {
      throw lastWorkoutError;
    }

    // Get total workouts in last 30 days
    const { count: totalWorkouts, error: countError } = await supabase
      .from('workouts')
      .select('*', { count: 'exact', head: true })
      .eq('is_rest_day', false)
      .gte('workout_date', thirtyDaysAgo.toISOString().split('T')[0]);

    if (countError) throw countError;

    // Calculate average workouts per week (last 30 days)
    const avgWorkoutsPerWeek = totalWorkouts ? (totalWorkouts / 30) * 7 : 0;

    // Calculate consistency score
    const { data: recentWorkouts, error: recentError } = await supabase
      .from('workouts')
      .select('workout_date')
      .eq('is_rest_day', false)
      .gte('workout_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('workout_date', { ascending: true });

    if (recentError) throw recentError;

    let consistencyScore = 100;
    if (recentWorkouts && recentWorkouts.length > 1) {
      const gaps: number[] = [];
      for (let i = 1; i < recentWorkouts.length; i++) {
        const prevDate = new Date(recentWorkouts[i - 1].workout_date);
        const currDate = new Date(recentWorkouts[i].workout_date);
        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        gaps.push(daysDiff);
      }
      
      // Penalize large gaps (more than 3 days)
      const largeGaps = gaps.filter(gap => gap > 3).length;
      consistencyScore = Math.max(0, 100 - (largeGaps * 15));
    }

    const stats: DashboardStats = {
      lastWorkout: lastWorkoutData ? {
        date: lastWorkoutData.workout_date,
        title: lastWorkoutData.title,
        volume: lastWorkoutData.total_volume,
      } : null,
      totalWorkouts: totalWorkouts || 0,
      avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10,
      consistencyScore: Math.round(consistencyScore),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
