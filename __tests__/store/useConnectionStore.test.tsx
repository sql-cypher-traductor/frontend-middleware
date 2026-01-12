import type { Connection, DatabaseSchemaResponse } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { useConnectionStore } from '@/store/useConnectionStore'
import { beforeEach, describe, expect, test, vi } from 'vitest'

// Mock del apiClient
vi.mock('@/lib/axios', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('useConnectionStore - CON-01', () => {
  beforeEach(() => {
    // Reset store before each test
    useConnectionStore.setState({
      connections: [],
      isLoading: false,
      error: null,
      selectedConnection: null,
      activeSqlConnectionId: null,
      activeNeo4jConnectionId: null,
      databaseSchema: null,
    })
    vi.clearAllMocks()
  })

  test('initial state is empty', () => {
    const state = useConnectionStore.getState()
    expect(state.connections).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe(null)
    expect(state.selectedConnection).toBe(null)
    expect(state.activeSqlConnectionId).toBe(null)
    expect(state.activeNeo4jConnectionId).toBe(null)
    expect(state.databaseSchema).toBe(null)
  })

  test('fetchConnections loads connections successfully', async () => {
    const mockConnections: Connection[] = [
      {
        connection_id: 1,
        user_id: 1,
        conn_name: 'Test SQL Server',
        db_type: 'sql_server',
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        database_name: 'TestDB',
        created_at: '2024-01-01T00:00:00Z',
        is_active: true,
      },
      {
        connection_id: 2,
        user_id: 1,
        conn_name: 'Test Neo4j',
        db_type: 'neo4j',
        host: 'bolt://localhost',
        port: 7687,
        db_user: 'neo4j',
        created_at: '2024-01-01T00:00:00Z',
        is_active: false,
      },
    ]

    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockConnections })

    await useConnectionStore.getState().fetchConnections()

    const state = useConnectionStore.getState()
    expect(state.connections).toEqual(mockConnections)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe(null)
  })

  test('createConnection adds new connection', async () => {
    const newConnection: Connection = {
      connection_id: 3,
      user_id: 1,
      conn_name: 'New Connection',
      db_type: 'sql_server',
      host: 'localhost',
      port: 1433,
      db_user: 'sa',
      database_name: 'NewDB',
      created_at: '2024-01-01T00:00:00Z',
      is_active: false,
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: newConnection })

    const result = await useConnectionStore.getState().createConnection({
      conn_name: 'New Connection',
      db_type: 'sql_server',
      host: 'localhost',
      port: 1433,
      db_user: 'sa',
      db_password: 'password',
      database_name: 'NewDB',
    })

    expect(result).toEqual(newConnection)
    const state = useConnectionStore.getState()
    expect(state.connections).toContainEqual(newConnection)
  })

  test('updateConnection modifies existing connection', async () => {
    const existingConnection: Connection = {
      connection_id: 1,
      user_id: 1,
      conn_name: 'Old Name',
      db_type: 'sql_server',
      host: 'localhost',
      port: 1433,
      db_user: 'sa',
      created_at: '2024-01-01T00:00:00Z',
      is_active: true,
    }

    useConnectionStore.setState({ connections: [existingConnection] })

    const updatedConnection: Connection = {
      ...existingConnection,
      conn_name: 'New Name',
    }

    vi.mocked(apiClient.put).mockResolvedValueOnce({ data: updatedConnection })

    await useConnectionStore.getState().updateConnection(1, {
      conn_name: 'New Name',
    })

    const state = useConnectionStore.getState()
    expect(state.connections[0].conn_name).toBe('New Name')
  })

  test('deleteConnection removes connection', async () => {
    const connections: Connection[] = [
      {
        connection_id: 1,
        user_id: 1,
        conn_name: 'Connection 1',
        db_type: 'sql_server',
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        created_at: '2024-01-01T00:00:00Z',
        is_active: true,
      },
      {
        connection_id: 2,
        user_id: 1,
        conn_name: 'Connection 2',
        db_type: 'neo4j',
        host: 'bolt://localhost',
        port: 7687,
        db_user: 'neo4j',
        created_at: '2024-01-01T00:00:00Z',
        is_active: false,
      },
    ]

    useConnectionStore.setState({ connections })

    vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: {} })

    await useConnectionStore.getState().deleteConnection(1)

    const state = useConnectionStore.getState()
    expect(state.connections).toHaveLength(1)
    expect(state.connections[0].connection_id).toBe(2)
  })

  test('testConnection returns test result', async () => {
    const testResult = {
      success: true,
      message: 'Connection successful',
      connection_time_ms: 50,
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: testResult })

    const result = await useConnectionStore.getState().testConnection({
      db_type: 'sql_server',
      host: 'localhost',
      port: 1433,
      db_user: 'sa',
      db_password: 'password',
    })

    expect(result).toEqual(testResult)
  })

  test('setSelectedConnection updates selected connection', () => {
    const connection: Connection = {
      connection_id: 1,
      user_id: 1,
      conn_name: 'Selected',
      db_type: 'sql_server',
      host: 'localhost',
      port: 1433,
      db_user: 'sa',
      database_name: 'TestDB',
      created_at: '2024-01-01T00:00:00Z',
      is_active: true,
    }

    useConnectionStore.getState().setSelectedConnection(connection)

    const state = useConnectionStore.getState()
    expect(state.selectedConnection).toEqual(connection)
  })

  test('clearError removes error message', () => {
    useConnectionStore.setState({ error: 'Some error' })

    useConnectionStore.getState().clearError()

    const state = useConnectionStore.getState()
    expect(state.error).toBe(null)
  })

  test('handles fetch error', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'))

    await expect(useConnectionStore.getState().fetchConnections()).rejects.toThrow()

    const state = useConnectionStore.getState()
    expect(state.error).toBe('Error al cargar las conexiones')
    expect(state.isLoading).toBe(false)
  })

  // ============================================================================
  // Tests de nuevas funcionalidades - CON-01
  // ============================================================================

  test('testExistingConnection uses new endpoint', async () => {
    const testResult = {
      success: true,
      message: 'Connection successful',
      connection_time_ms: 50,
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: testResult })

    const result = await useConnectionStore.getState().testExistingConnection(1)

    expect(apiClient.post).toHaveBeenCalledWith('/connections/1/test')
    expect(result).toEqual(testResult)
  })

  test('getDatabaseSchema fetches schema successfully', async () => {
    const mockSchema: DatabaseSchemaResponse = {
      database_name: 'TestDB',
      tables: [
        {
          name: 'Users',
          schema_name: 'dbo',
          columns: [
            {
              name: 'user_id',
              data_type: 'int',
              is_nullable: false,
              is_primary_key: true,
              is_foreign_key: false,
            },
          ],
          row_count: 100,
        },
      ],
      relationships: [],
      retrieved_at: '2024-01-01T00:00:00Z',
    }

    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockSchema })

    const result = await useConnectionStore.getState().getDatabaseSchema(1)

    expect(apiClient.get).toHaveBeenCalledWith('/connections/1/schema')
    expect(result).toEqual(mockSchema)
    expect(useConnectionStore.getState().databaseSchema).toEqual(mockSchema)
  })

  test('setActiveConnection updates active connection ID for SQL Server', () => {
    useConnectionStore.getState().setActiveConnection(5, 'sql_server')

    const state = useConnectionStore.getState()
    expect(state.activeSqlConnectionId).toBe(5)
    expect(state.activeNeo4jConnectionId).toBe(null)
  })

  test('setActiveConnection updates active connection ID for Neo4j', () => {
    useConnectionStore.getState().setActiveConnection(6, 'neo4j')

    const state = useConnectionStore.getState()
    expect(state.activeSqlConnectionId).toBe(null)
    expect(state.activeNeo4jConnectionId).toBe(6)
  })

  test('setActiveConnection to null clears schema for SQL Server', () => {
    // Set initial state with schema and active connection
    useConnectionStore.setState({
      activeSqlConnectionId: 1,
      databaseSchema: {
        database_name: 'TestDB',
        tables: [],
        relationships: [],
        retrieved_at: '2024-01-01T00:00:00Z',
      },
    })

    useConnectionStore.getState().setActiveConnection(null, 'sql_server')

    const state = useConnectionStore.getState()
    expect(state.activeSqlConnectionId).toBe(null)
    expect(state.databaseSchema).toBe(null)
  })

  test('deleteConnection clears activeSqlConnectionId if deleted', async () => {
    const connections: Connection[] = [
      {
        connection_id: 1,
        user_id: 1,
        conn_name: 'Active Connection',
        db_type: 'sql_server',
        host: 'localhost',
        port: 1433,
        db_user: 'sa',
        database_name: 'TestDB',
        created_at: '2024-01-01T00:00:00Z',
        is_active: true,
      },
    ]

    useConnectionStore.setState({
      connections,
      activeSqlConnectionId: 1,
      databaseSchema: {
        database_name: 'TestDB',
        tables: [],
        relationships: [],
        retrieved_at: '2024-01-01T00:00:00Z',
      },
    })

    vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: {} })

    await useConnectionStore.getState().deleteConnection(1)

    const state = useConnectionStore.getState()
    expect(state.connections).toHaveLength(0)
    expect(state.activeSqlConnectionId).toBe(null)
    expect(state.databaseSchema).toBe(null)
  })

  test('clearSchema removes database schema', () => {
    useConnectionStore.setState({
      databaseSchema: {
        database_name: 'TestDB',
        tables: [],
        relationships: [],
        retrieved_at: '2024-01-01T00:00:00Z',
      },
    })

    useConnectionStore.getState().clearSchema()

    const state = useConnectionStore.getState()
    expect(state.databaseSchema).toBe(null)
  })
})
