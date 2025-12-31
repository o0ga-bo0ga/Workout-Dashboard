import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Use workout_date as the primary key (id param contains the date)
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('workout_date', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Workout detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout details' },
      { status: 500 }
    );
  }
}
