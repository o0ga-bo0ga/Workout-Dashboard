import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('workout_date', date)
      .maybeSingle();

    if (error) throw error;

    // Return null if no workout found (rest day)
    return NextResponse.json(data);
  } catch (error) {
    console.error('Workout by date error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}
