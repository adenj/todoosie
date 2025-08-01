import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { TodoApp } from '@/components/TodoApp'
import { Auth } from '@/components/Auth'
import { Box, Spinner, VStack } from '@chakra-ui/react'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <VStack gap={4}>
          <Spinner size="lg" />
        </VStack>
      </Box>
    )
  }

  return user ? <TodoApp /> : <Auth />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
