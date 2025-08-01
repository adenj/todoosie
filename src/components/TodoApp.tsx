import { Container, VStack, Heading, Separator, HStack, Button, Text } from '@chakra-ui/react';
import { useTodos } from '@/hooks/useTodos';
import { useAuth } from '@/contexts/AuthContext';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
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
    clearCompleted
  } = useTodos();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Container maxW="2xl" py={8}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading
            size="2xl"
            color="blue.500"
            _dark={{ color: 'blue.300' }}
          >
            Todoosie
          </Heading>
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
        
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
        
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