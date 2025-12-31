import { supabase } from '@/lib/supabase';
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

  // Comprehensive exercise-to-muscle-group mapping based on Lyfta categorization
  const classifyMuscleGroup = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase();
    
    // Chest exercises
    if (name.includes('bench press') || name.includes('bench') || name.includes('chest press') ||
        name.includes('chest fly') || name.includes('pec deck') || name.includes('cable crossover') ||
        name.includes('incline press') || name.includes('decline press') || name.includes('push up') ||
        name.includes('pushup') || name.includes('chest dip')) {
      return 'Chest';
    }
    
    // Back exercises
    if (name.includes('deadlift') || name.includes('row') || name.includes('pull up') ||
        name.includes('pullup') || name.includes('chin up') || name.includes('lat pulldown') ||
        name.includes('lat pull') || name.includes('t-bar') || name.includes('face pull') ||
        name.includes('shrug') || name.includes('hyperextension')) {
      return 'Back';
    }
    
    // Shoulders exercises
    if (name.includes('shoulder press') || name.includes('military press') || 
        name.includes('overhead press') || name.includes('arnold press') ||
        name.includes('lateral raise') || name.includes('front raise') || 
        name.includes('rear delt') || name.includes('upright row')) {
      return 'Shoulders';
    }
    
    // Biceps exercises
    if (name.includes('bicep curl') || name.includes('biceps curl') || 
        name.includes('barbell curl') || name.includes('dumbbell curl') ||
        name.includes('hammer curl') || name.includes('preacher curl') ||
        name.includes('concentration curl') || name.includes('cable curl')) {
      return 'Biceps';
    }
    
    // Triceps exercises
    if (name.includes('tricep') || name.includes('skull crusher') ||
        name.includes('close grip') || name.includes('close-grip') ||
        name.includes('pushdown') || name.includes('overhead extension') ||
        name.includes('tricep dip')) {
      return 'Triceps';
    }
    
    // Forearms exercises
    if (name.includes('wrist curl') || name.includes('reverse curl') ||
        name.includes('farmer') || name.includes('grip')) {
      return 'Forearms';
    }
    
    // Quadriceps exercises
    if (name.includes('squat') || name.includes('leg press') ||
        name.includes('leg extension') || name.includes('lunge') ||
        name.includes('bulgarian split')) {
      return 'Quadriceps';
    }
    
    // Hamstrings exercises
    if (name.includes('leg curl') || name.includes('romanian deadlift') ||
        name.includes('rdl') || name.includes('good morning') ||
        name.includes('nordic curl')) {
      return 'Hamstrings';
    }
    
    // Calves exercises
    if (name.includes('calf raise') || name.includes('calf') ||
        name.includes('donkey calf')) {
      return 'Calves';
    }
    
    // Glutes exercises
    if (name.includes('hip thrust') || name.includes('glute bridge') ||
        name.includes('kickback') || name.includes('sumo deadlift') ||
        name.includes('glute')) {
      return 'Glutes';
    }
    
    // Abs/Core exercises
    if (name.includes('crunch') || name.includes('sit-up') || name.includes('sit up') ||
        name.includes('plank') || name.includes('ab wheel') || name.includes('leg raise') ||
        name.includes('russian twist') || name.includes('cable crunch') ||
        name.includes('core') || name.match(/\babs?\b/)) {
      return 'Abs';
    }
    
    // Cardio exercises
    if (name.includes('run') || name.includes('cycle') || name.includes('bike') ||
        name.includes('row machine') || name.includes('elliptical') ||
        name.includes('jump rope') || name.includes('cardio')) {
      return 'Cardio';
    }
    
    return 'Other';
  };

  // Aggregate volume by muscle group (using all Lyfta categories)
  const muscleGroupVolumes: { [key: string]: number } = {
    'Chest': 0,
    'Back': 0,
    'Shoulders': 0,
    'Biceps': 0,
    'Triceps': 0,
    'Forearms': 0,
    'Quadriceps': 0,
    'Hamstrings': 0,
    'Calves': 0,
    'Glutes': 0,
    'Abs': 0,
    'Cardio': 0,
  };

  (data || []).forEach((workout: any) => {
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
