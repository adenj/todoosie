import { type Todo } from '@/types/todo';

const TODOS_STORAGE_KEY = 'todoosie-todos';

export const saveTodos = (todos: Todo[]): void => {
  try {
    const todosToSave = todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString()
    }));
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todosToSave));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

export const loadTodos = (): Todo[] => {
  try {
    const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
    if (!storedTodos) return [];

    const parsedTodos = JSON.parse(storedTodos);
    return parsedTodos.map((todo: { id: string; text: string; completed: boolean; createdAt: string }) => ({
      ...todo,
      createdAt: new Date(todo.createdAt)
    }));
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};