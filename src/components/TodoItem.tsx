import { useState } from 'react';
import {
  HStack,
  Checkbox,
  Text,
  Input,
  IconButton,
  Box
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { type Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(todo.id, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(todo.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Box
      p={3}
      borderWidth={1}
      borderRadius="md"
      bg={todo.completed ? 'gray.50' : 'white'}
      _dark={{
        bg: todo.completed ? 'gray.800' : 'gray.900',
        borderColor: 'gray.700'
      }}
    >
      <HStack gap={3}>
        <Checkbox.Root
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          colorPalette="green"
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Root>

        {isEditing ? (
          <>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              size="sm"
              flex={1}
              autoFocus
            />
            <IconButton
              aria-label="Save edit"
              size="sm"
              colorPalette="green"
              onClick={handleSave}
            >
              <FiCheck />
            </IconButton>
            <IconButton
              aria-label="Cancel edit"
              size="sm"
              variant="ghost"
              onClick={handleCancel}
            >
              <FiX />
            </IconButton>
          </>
        ) : (
          <>
            <Text
              flex={1}
              textDecoration={todo.completed ? 'line-through' : 'none'}
              opacity={todo.completed ? 0.6 : 1}
            >
              {todo.title}
            </Text>
            <IconButton
              aria-label="Edit todo"
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit2 />
            </IconButton>
            <IconButton
              aria-label="Delete todo"
              size="sm"
              variant="ghost"
              colorPalette="red"
              onClick={() => onDelete(todo.id)}
            >
              <FiTrash2 />
            </IconButton>
          </>
        )}
      </HStack>
    </Box>
  );
};