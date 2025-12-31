import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all workouts from the last 12 weeks
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

    const { data, error } = await supabase
      .from('workouts')
      .select('workout_date, total_volume')
      .eq('is_rest_day', false)
      .gte('workout_date', twelveWeeksAgo.toISOString().split('T')[0])
      .order('workout_date', { ascending: true });

    if (error) throw error;

    // Group by week and sum total volume
    const weekMap = new Map<string, number>();
    
    (data || []).forEach(workout => {
      const date = new Date(workout.workout_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + workout.total_volume);
    });

    // Convert to array and format
    const weeklyData = Array.from(weekMap.entries())
      .map(([week, totalVolume]) => ({
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalVolume,
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    return NextResponse.json(weeklyData);
  } catch (error) {
    console.error('Weekly volume error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly volume data' },
      { status: 500 }
    );
  }
}
