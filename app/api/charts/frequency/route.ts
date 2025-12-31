import { supabase } from '@/lib/supabase';
import { FrequencyDataPoint } from '@/types/workout';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks

    const { data, error } = await supabase
      .from('workouts')
      .select('workout_date')
      .eq('is_rest_day', false)
      .gte('workout_date', twelveWeeksAgo.toISOString().split('T')[0])
      .order('workout_date', { ascending: true });

    if (error) throw error;

    // Group workouts by week
    const weekMap = new Map<string, number>();
    
    (data || []).forEach(workout => {
      const date = new Date(workout.workout_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
    });

    // Convert to array and format
    const frequencyData: FrequencyDataPoint[] = Array.from(weekMap.entries())
      .map(([week, count]) => ({
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    return NextResponse.json(frequencyData);
  } catch (error) {
    console.error('Frequency chart error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch frequency data' },
      { status: 500 }
    );
  }
}
