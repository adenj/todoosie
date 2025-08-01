export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  position: number;
}

export type FilterType = 'all' | 'active' | 'completed';