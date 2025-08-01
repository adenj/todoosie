import { useState } from 'react'
import { Box, Button, Input, VStack, Text, Heading } from '@chakra-ui/react'
import { useAuth } from '@/contexts/AuthContext'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        }
      } else {
        const { error } = await signUp(email, password)
        if (error) {
          setError(error.message)
        } else {
          setMessage('Check your email for the confirmation link!')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="400px" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack gap={4}>
        <Heading size="lg">{isLogin ? 'Sign In' : 'Sign Up'}</Heading>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack gap={4}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              colorPalette="blue"
              width="100%"
              loading={loading}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </VStack>
        </form>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}

        {message && (
          <Text color="green.500" fontSize="sm">
            {message}
          </Text>
        )}

        <Button
          variant="ghost"
          onClick={() => setIsLogin(!isLogin)}
          size="sm"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </Button>
      </VStack>
    </Box>
  )
}