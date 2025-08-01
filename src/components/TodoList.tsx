import { VStack, Text } from '@chakra-ui/react';
import { type Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const TodoList = ({ todos, onToggle, onDelete, onEdit }: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <Text
        textAlign="center"
        color="gray.500"
        py={8}
        fontSize="lg"
      >
        No todos yet. Add one above!
      </Text>
    );
  }

  return (
    <VStack gap={2} align="stretch">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </VStack>
  );
};