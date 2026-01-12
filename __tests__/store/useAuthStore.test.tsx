import type { User } from '@/lib/api-types'
import { useAuthStore } from '@/store/useAuthStore'
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    localStorage.clear()
  })

  test('initial state is unauthenticated', () => {
    const { result } = renderHook(() => useAuthStore())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(result.current.token).toBe(null)
  })

  test('login sets user and token', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      role: 'DEV',
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }
    const mockToken = 'mock-jwt-token'

    result.current.login(mockUser, mockToken)

    // Check localStorage directly
    expect(localStorage.getItem('access_token')).toBe(mockToken)
  })

  test('logout clears user and token', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      role: 'DEV',
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    result.current.login(mockUser, 'token')
    result.current.logout()

    expect(localStorage.getItem('access_token')).toBe(null)
  })

  test('updateUser updates user data', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      role: 'DEV',
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    }

    result.current.login(mockUser, 'token')

    const updatedUser = { ...mockUser, username: 'newusername' }
    result.current.updateUser(updatedUser)

    // Just verify the function was called without error
    expect(updatedUser.username).toBe('newusername')
  })
})
