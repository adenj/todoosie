import { useState } from 'react';
import {
  HStack,
  Checkbox,
  Text,
  Input,
  IconButton,
  Box
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiMenu } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  isDragOverlay?: boolean;
}

export const TodoItem = ({ todo, onToggle, onDelete, onEdit, isDragOverlay = false }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const sortable = useSortable({ 
    id: todo.id,
    disabled: isDragOverlay,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = isDragOverlay ? {
    // Drag overlay styles
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  } : {
    // Normal sortable styles
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
      ref={setNodeRef}
      style={style}
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
        {/* Drag Handle */}
        <IconButton
          ref={isDragOverlay ? undefined : setActivatorNodeRef}
          {...(isDragOverlay ? {} : attributes)}
          {...(isDragOverlay ? {} : listeners)}
          aria-label="Drag handle"
          size="sm"
          variant="ghost"
          cursor={isDragOverlay ? "default" : "grab"}
          _active={{ cursor: isDragOverlay ? "default" : 'grabbing' }}
          opacity={isEditing ? 0.3 : 1}
          disabled={isEditing || isDragOverlay}
        >
          <FiMenu />
        </IconButton>
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