export interface Workout {
  id?: number;
  workout_date: string;
  title: string;
  description: string;
  total_volume: number;
  is_rest_day: boolean;
  created_at: string;
}

export interface WeeklyVolumeData {
  week: string;
  totalVolume: number;
}
