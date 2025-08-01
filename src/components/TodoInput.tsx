import { useState } from 'react';
import { Input, Button, HStack } from '@chakra-ui/react';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <HStack gap={3}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          size="lg"
          flex={1}
        />
        <Button
          type="submit"
          colorPalette="blue"
          size="lg"
          disabled={!inputValue.trim()}
        >
          Add
        </Button>
      </HStack>
    </form>
  );
};