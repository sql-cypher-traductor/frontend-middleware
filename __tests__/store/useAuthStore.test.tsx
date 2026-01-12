import type { User } from '@/lib/api-types'
import { useAuthStore } from '@/store/useAuthStore'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'

/**
 * Tests para el store de autenticación - HU AUM-01
 * Verifica el manejo de estado de autenticación y persistencia
 */
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
      user_id: 1,
      email: 'test@example.com',
      name: 'Test',
      last_name: 'User',
      role: 'DEV',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      last_login: null,
    }
    const mockToken = 'mock-jwt-token'

    act(() => {
      result.current.login(mockUser, mockToken)
    })

    // Check localStorage and state
    expect(localStorage.getItem('access_token')).toBe(mockToken)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.email).toBe('test@example.com')
  })

  test('logout clears user and token', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser: User = {
      user_id: 1,
      email: 'test@example.com',
      name: 'Test',
      last_name: 'User',
      role: 'DEV',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-01-01T12:00:00Z',
    }

    act(() => {
      result.current.login(mockUser, 'token')
    })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('access_token')).toBe(null)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  test('updateUser updates user data', () => {
    const { result } = renderHook(() => useAuthStore())
    const mockUser: User = {
      user_id: 1,
      email: 'test@example.com',
      name: 'Test',
      last_name: 'User',
      role: 'DEV',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      last_login: null,
    }

    act(() => {
      result.current.login(mockUser, 'token')
    })

    const updatedUser: User = {
      ...mockUser,
      name: 'Updated',
      last_name: 'Name',
    }

    act(() => {
      result.current.updateUser(updatedUser)
    })

    // Verify the update was applied
    expect(result.current.user?.name).toBe('Updated')
    expect(result.current.user?.last_name).toBe('Name')
  })
})
