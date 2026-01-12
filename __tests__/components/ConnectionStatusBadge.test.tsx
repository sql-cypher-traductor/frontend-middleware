import { ConnectionStatusBadge } from '@/components/connections/ConnectionStatusBadge'
import type { Connection } from '@/lib/api-types'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

describe('ConnectionStatusBadge', () => {
  afterEach(() => {
    cleanup()
  })

  const mockConnection: Connection = {
    connection_id: 1,
    user_id: 1,
    conn_name: 'Test Connection',
    db_type: 'sql_server',
    host: 'localhost',
    port: 1433,
    db_user: 'sa',
    created_at: '2024-01-01T00:00:00Z',
    is_active: true,
  }

  test('renders active badge when is_active is true', () => {
    render(<ConnectionStatusBadge connection={mockConnection} />)
    expect(screen.getByText('Activa')).toBeTruthy()
  })

  test('renders inactive badge when is_active is false', () => {
    const inactiveConnection = { ...mockConnection, is_active: false }
    render(<ConnectionStatusBadge connection={inactiveConnection} />)
    expect(screen.getByText('Inactiva')).toBeTruthy()
  })

  test('renders loading state when isTestLoading is true', () => {
    render(<ConnectionStatusBadge connection={mockConnection} isTestLoading={true} />)
    expect(screen.getByText('Probando...')).toBeTruthy()
  })

  test('renders inactive badge when is_active is undefined', () => {
    const undefinedConnection = { ...mockConnection, is_active: undefined }
    render(<ConnectionStatusBadge connection={undefinedConnection} />)
    expect(screen.getAllByText('Inactiva').length).toBeGreaterThan(0)
  })

  test('applies correct CSS classes for active state', () => {
    const { container } = render(<ConnectionStatusBadge connection={mockConnection} />)
    const badge = container.querySelector('.bg-green-100')
    expect(badge).toBeTruthy()
  })

  test('applies correct CSS classes for inactive state', () => {
    const inactiveConnection = { ...mockConnection, is_active: false }
    const { container } = render(<ConnectionStatusBadge connection={inactiveConnection} />)
    const badge = container.querySelector('.bg-red-100')
    expect(badge).toBeTruthy()
  })
})
