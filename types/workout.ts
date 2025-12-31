export interface Workout {
  id?: number;
  workout_date: string;
  title: string;
  description: string;
  total_volume: number;
  is_rest_day: boolean;
  created_at: string;
}

export interface DashboardStats {
  lastWorkout: {
    date: string;
    title: string;
    volume: number;
  } | null;
  totalWorkouts: number;
  avgWorkoutsPerWeek: number;
  consistencyScore: number;
}

export interface VolumeDataPoint {
  date: string;
  volume: number;
}

export interface FrequencyDataPoint {
  week: string;
  count: number;
}
