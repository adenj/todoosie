import { Button, HStack } from '@chakra-ui/react';
import { type FilterType } from '@/types/todo';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TodoFilters = ({ currentFilter, onFilterChange }: TodoFiltersProps) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <HStack gap={2} justify="center">
      {filters.map(({ label, value }) => (
        <Button
          key={value}
          variant={currentFilter === value ? 'solid' : 'ghost'}
          colorPalette={currentFilter === value ? 'blue' : 'gray'}
          size="sm"
          onClick={() => onFilterChange(value)}
        >
          {label}
        </Button>
      ))}
    </HStack>
  );
};