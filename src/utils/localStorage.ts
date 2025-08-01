import { type Todo } from '@/types/todo';

const TODOS_STORAGE_KEY = 'todoosie-todos';

export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

export const loadTodos = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!storedTodos) return [];

    return JSON.parse(storedTodos);
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};