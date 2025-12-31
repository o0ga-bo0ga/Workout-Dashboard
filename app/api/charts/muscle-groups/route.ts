import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'startDate and endDate are required' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  // Fetch workouts in date range
  const { data, error } = await supabase
    .from('workouts')
    .select('description, total_volume')
    .gte('workout_date', startDate)
    .lte('workout_date', endDate)
    .not('total_volume', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Function to classify exercise into muscle group
  const classifyMuscleGroup = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase();
    
    if (name.includes('curl') || name.includes('tricep') || name.includes('bicep') || name.includes('arm')) {
      return 'Arms';
    }
    if (name.includes('squat') || name.includes('leg') || name.includes('lunge') || name.includes('calf')) {
      return 'Legs';
    }
    if (name.includes('bench') || name.includes('chest') || name.includes('press') || name.includes('fly')) {
      return 'Chest';
    }
    if (name.includes('row') || name.includes('pull') || name.includes('lat') || name.includes('deadlift')) {
      return 'Back';
    }
    if (name.includes('shoulder') || name.includes('raise') || name.includes('lateral') || name.includes('overhead')) {
      return 'Shoulders';
    }
    if (name.includes('crunch') || name.includes('plank') || name.includes('ab') || name.includes('core')) {
      return 'Abs';
    }
    
    return 'Other';
  };

  // Aggregate volume by muscle group
  const muscleGroupVolumes: { [key: string]: number } = {
    'Arms': 0,
    'Legs': 0,
    'Chest': 0,
    'Back': 0,
    'Shoulders': 0,
    'Abs': 0,
  };

  (data || []).forEach(workout => {
    if (!workout.description) return;

    try {
      const exercises = typeof workout.description === 'object'
        ? workout.description
        : JSON.parse(workout.description);

      Object.keys(exercises).forEach(exerciseName => {
        const muscleGroup = classifyMuscleGroup(exerciseName);
        if (muscleGroup !== 'Other') {
          // Estimate volume contribution (total volume / number of exercises)
          const exerciseCount = Object.keys(exercises).length;
          const volumePerExercise = workout.total_volume / exerciseCount;
          muscleGroupVolumes[muscleGroup] += volumePerExercise;
        }
      });
    } catch (e) {
      // Skip workouts with invalid description format
    }
  });

  // Calculate total and percentages
  const totalVolume = Object.values(muscleGroupVolumes).reduce((sum, vol) => sum + vol, 0);

  const result = Object.entries(muscleGroupVolumes)
    .map(([muscleGroup, volume]) => ({
      muscleGroup,
      volume: Math.round(volume),
      percentage: totalVolume > 0 ? Math.round((volume / totalVolume) * 100) : 0,
    }))
    .filter(item => item.volume > 0) // Only include muscle groups with volume
    .sort((a, b) => b.volume - a.volume); // Sort by volume descending

  return NextResponse.json(result);
}
