import { Container, VStack, Heading, Separator, HStack, Button, Text, Image } from '@chakra-ui/react';
import { DndContext, closestCenter, DragOverlay, useSensors, useSensor, PointerSensor, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { useAuth } from '@/contexts/AuthContext';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoItem } from './TodoItem';
import { TodoFilters } from './TodoFilters';
import { TodoStats } from './TodoStats';

export const TodoApp = () => {
  const { user, signOut } = useAuth();
  const {
    todos,
    filter,
    activeCount,
    completedCount,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    reorderTodos
  } = useTodos();

  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors for better drag experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id);
      const newIndex = todos.findIndex(todo => todo.id === over!.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder todos locally with arrayMove
        const reorderedTodos = arrayMove(todos, oldIndex, newIndex);
        // Update positions in database
        reorderTodos(reorderedTodos);
      }
    }

    setActiveId(null);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Container maxW="2xl" py={8}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack align="center" gap={1}>
            <Image
              src="/logo.png"
              alt="Todoosie Logo"
              boxSize="40px"
              objectFit="contain"
            />
            <Heading
              size="2xl"
              color="blue.500"
              _dark={{ color: 'blue.300' }}
            >
              Todoosie
            </Heading>
          </HStack>
          <VStack gap={1} align="end">
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              {user?.email}
            </Text>
            <Button size="sm" variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </VStack>
        </HStack>

        <TodoInput onAddTodo={addTodo} />

        <Separator />

        <TodoFilters
          currentFilter={filter}
          onFilterChange={setFilter}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todos.map(todo => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <TodoItem
                todo={todos.find(todo => todo.id === activeId)!}
                onToggle={() => { }}
                onDelete={() => { }}
                onEdit={() => { }}
                isDragOverlay={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {(activeCount > 0 || completedCount > 0) && (
          <>
            <Separator />
            <TodoStats
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </VStack>
    </Container>
  );
};