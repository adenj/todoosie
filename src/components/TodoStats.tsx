import { HStack, Text, Button, Spacer } from '@chakra-ui/react';

interface TodoStatsProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export const TodoStats = ({ activeCount, completedCount, onClearCompleted }: TodoStatsProps) => {
  return (
    <HStack gap={4} py={2}>
      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </Text>
      
      <Spacer />
      
      {completedCount > 0 && (
        <Button
          size="sm"
          variant="ghost"
          colorPalette="red"
          onClick={onClearCompleted}
        >
          Clear completed ({completedCount})
        </Button>
      )}
    </HStack>
  );
};