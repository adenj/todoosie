import { useState, useEffect } from 'react';
import { type Todo, type FilterType } from '@/types/todo';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodos();
      
      // Subscribe to real-time changes
      console.log('Setting up real-time subscription for user:', user.id);
      const subscription = supabase
        .channel('todos')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'todos',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Real-time change:', payload);
            
            if (payload.eventType === 'INSERT') {
              const newTodo = payload.new as Todo;
              setTodos(prev => {
                // Check if todo already exists to avoid duplicates
                if (prev.some(todo => todo.id === newTodo.id)) {
                  return prev;
                }
                return [newTodo, ...prev];
              });
            } else if (payload.eventType === 'UPDATE') {
              const updatedTodo = payload.new as Todo;
              setTodos(prev => prev.map(todo =>
                todo.id === updatedTodo.id ? updatedTodo : todo
              ));
            } else if (payload.eventType === 'DELETE') {
              const deletedTodo = payload.old as Todo;
              setTodos(prev => prev.filter(todo => todo.id !== deletedTodo.id));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  const addTodo = async (text: string): Promise<void> => {
    if (text.trim() === '' || !user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title: text.trim(),
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding todo:', error);
    } else if (data) {
      // Optimistic update - real-time should also trigger but this ensures immediate feedback
      setTodos(prev => {
        const newTodos = data.filter(newTodo => !prev.some(todo => todo.id === newTodo.id));
        return [...newTodos, ...prev];
      });
    }
    setLoading(false);
  };

  const toggleTodo = async (id: string): Promise<void> => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Optimistic update
    const newCompleted = !todo.completed;
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: newCompleted } : t
    ));

    const { error } = await supabase
      .from('todos')
      .update({ completed: newCompleted })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
      // Revert optimistic update on error
      setTodos(prev => prev.map(t =>
        t.id === id ? { ...t, completed: !newCompleted } : t
      ));
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    // Store the todo for potential rollback
    const todoToDelete = todos.find(t => t.id === id);
    
    // Optimistic update
    setTodos(prev => prev.filter(todo => todo.id !== id));

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      // Revert optimistic update on error
      if (todoToDelete) {
        setTodos(prev => [todoToDelete, ...prev]);
      }
    }
  };

  const editTodo = async (id: string, newText: string): Promise<void> => {
    if (newText.trim() === '') return;

    // Store original text for potential rollback
    const originalTodo = todos.find(t => t.id === id);
    const trimmedText = newText.trim();
    
    // Optimistic update
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, title: trimmedText } : todo
    ));

    const { error } = await supabase
      .from('todos')
      .update({ title: trimmedText })
      .eq('id', id);

    if (error) {
      console.error('Error editing todo:', error);
      // Revert optimistic update on error
      if (originalTodo) {
        setTodos(prev => prev.map(todo =>
          todo.id === id ? { ...todo, title: originalTodo.title } : todo
        ));
      }
    }
  };

  const clearCompleted = async (): Promise<void> => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);
    
    if (completedIds.length === 0) return;

    // Optimistic update
    setTodos(prev => prev.filter(todo => !todo.completed));

    const { error } = await supabase
      .from('todos')
      .delete()
      .in('id', completedIds);

    if (error) {
      console.error('Error clearing completed todos:', error);
      // Revert optimistic update on error
      setTodos(prev => [...completedTodos, ...prev]);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return {
    todos: filteredTodos,
    filter,
    activeCount,
    completedCount,
    loading,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted
  };
};