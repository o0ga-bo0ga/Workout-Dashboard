import { supabase } from '@/lib/supabase';
import { VolumeDataPoint } from '@/types/workout';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data, error } = await supabase
      .from('workouts')
      .select('workout_date, total_volume')
      .eq('is_rest_day', false)
      .gte('workout_date', ninetyDaysAgo.toISOString().split('T')[0])
      .order('workout_date', { ascending: true });

    if (error) throw error;

    const volumeData: VolumeDataPoint[] = (data || []).map(workout => ({
      date: workout.workout_date,
      volume: workout.total_volume,
    }));

    return NextResponse.json(volumeData);
  } catch (error) {
    console.error('Volume chart error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volume data' },
      { status: 500 }
    );
  }
}
