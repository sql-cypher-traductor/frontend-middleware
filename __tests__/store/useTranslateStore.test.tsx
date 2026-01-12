import type { QueryHistory, TranslateResponse } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { useTranslateStore } from '@/store/useTranslateStore'
import { beforeEach, describe, expect, test, vi } from 'vitest'

// Mock del apiClient
vi.mock('@/lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('useTranslateStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useTranslateStore.setState({
      sqlQuery: '',
      currentQueryId: null,
      cypherResult: null,
      metadata: null,
      warnings: [],
      traductionTime: null,
      status: null,
      isTranslating: false,
      isExecuting: false,
      error: null,
      history: [],
      isLoadingHistory: false,
      selectedConnectionId: null,
    })
    vi.clearAllMocks()
  })

  test('initial state is empty', () => {
    const state = useTranslateStore.getState()
    expect(state.sqlQuery).toBe('')
    expect(state.currentQueryId).toBe(null)
    expect(state.cypherResult).toBe(null)
    expect(state.isTranslating).toBe(false)
    expect(state.error).toBe(null)
    expect(state.history).toEqual([])
    expect(state.selectedConnectionId).toBe(null)
  })

  test('setSqlQuery updates the query', () => {
    useTranslateStore.getState().setSqlQuery('SELECT * FROM users')

    const state = useTranslateStore.getState()
    expect(state.sqlQuery).toBe('SELECT * FROM users')
    expect(state.error).toBe(null)
  })

  test('setSelectedConnectionId updates the connection', () => {
    useTranslateStore.getState().setSelectedConnectionId(123)

    const state = useTranslateStore.getState()
    expect(state.selectedConnectionId).toBe(123)
  })

  test('translateQuery translates successfully', async () => {
    const mockResponse: TranslateResponse = {
      query_id: 1,
      cypher_query: 'MATCH (n:User) RETURN n',
      status: 'traducido',
      traduction_time: 15.5,
      metadata: {
        query_type: 'SELECT',
        tables_detected: ['users'],
        complexity_score: 2,
      },
      warnings: [],
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse })
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] })

    const result = await useTranslateStore.getState().translateQuery({
      sql_query: 'SELECT * FROM users',
      neo4j_connection_id: 1,
    })

    expect(result).toEqual(mockResponse)

    const state = useTranslateStore.getState()
    expect(state.currentQueryId).toBe(1)
    expect(state.cypherResult).toBe('MATCH (n:User) RETURN n')
    expect(state.metadata?.query_type).toBe('SELECT')
    expect(state.traductionTime).toBe(15.5)
    expect(state.status).toBe('traducido')
    expect(state.isTranslating).toBe(false)
    expect(state.error).toBe(null)
  })

  test('translateQuery handles errors', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Translation failed'))

    await expect(
      useTranslateStore.getState().translateQuery({
        sql_query: 'INVALID SQL',
        neo4j_connection_id: 1,
      })
    ).rejects.toThrow()

    const state = useTranslateStore.getState()
    expect(state.error).toBe('Translation failed')
    expect(state.isTranslating).toBe(false)
    expect(state.cypherResult).toBe(null)
    expect(state.status).toBe('fallido')
  })

  test('executeQuery executes successfully', async () => {
    // Setup: First translate
    useTranslateStore.setState({ currentQueryId: 1, status: 'traducido' })

    const mockResponse = {
      query_id: 1,
      status: 'ejecutado' as const,
      execution_time: 25.3,
      nodes_affected: 10,
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse })
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] })

    const result = await useTranslateStore.getState().executeQuery({ query_id: 1 })

    expect(result.status).toBe('ejecutado')
    expect(result.execution_time).toBe(25.3)
    expect(result.nodes_affected).toBe(10)

    const state = useTranslateStore.getState()
    expect(state.status).toBe('ejecutado')
    expect(state.isExecuting).toBe(false)
  })

  test('executeQuery handles errors', async () => {
    useTranslateStore.setState({ currentQueryId: 1, status: 'traducido' })

    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Execution failed'))

    await expect(useTranslateStore.getState().executeQuery({ query_id: 1 })).rejects.toThrow()

    const state = useTranslateStore.getState()
    expect(state.error).toBe('Execution failed')
    expect(state.status).toBe('fallido')
    expect(state.isExecuting).toBe(false)
  })

  test('fetchHistory loads history from backend', async () => {
    const mockHistory = [
      {
        query_id: 1,
        user_id: 1,
        neo4j_connection_id: 1,
        sql_query: 'SELECT * FROM users',
        cypher_query: 'MATCH (n:User) RETURN n',
        status: 'ejecutado' as const,
        traduction_time: 10,
        execution_time: 25,
        nodes_affected: 5,
        created_at: '2024-01-01T00:00:00Z',
      },
    ]

    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockHistory })

    await useTranslateStore.getState().fetchHistory()

    const state = useTranslateStore.getState()
    expect(state.history).toHaveLength(1)
    expect(state.history[0].query_id).toBe(1)
    expect(state.isLoadingHistory).toBe(false)
  })

  test('translateQuery handles warnings', async () => {
    const mockResponse: TranslateResponse = {
      query_id: 2,
      cypher_query: 'MATCH (n:User) RETURN n',
      status: 'traducido',
      traduction_time: 20,
      warnings: ['Complex query detected', 'Some features may not be supported'],
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockResponse })
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] })

    await useTranslateStore.getState().translateQuery({
      sql_query: 'SELECT * FROM users',
      neo4j_connection_id: 1,
    })

    const state = useTranslateStore.getState()
    expect(state.warnings).toEqual(['Complex query detected', 'Some features may not be supported'])
  })

  test('clearResult clears translation data', () => {
    useTranslateStore.setState({
      currentQueryId: 1,
      cypherResult: 'MATCH (n) RETURN n',
      metadata: { query_type: 'SELECT', tables_detected: ['users'] },
      warnings: ['Warning'],
      traductionTime: 15,
      status: 'traducido',
      error: 'Some error',
    })

    useTranslateStore.getState().clearResult()

    const state = useTranslateStore.getState()
    expect(state.currentQueryId).toBe(null)
    expect(state.cypherResult).toBe(null)
    expect(state.metadata).toBe(null)
    expect(state.warnings).toEqual([])
    expect(state.traductionTime).toBe(null)
    expect(state.status).toBe(null)
    expect(state.error).toBe(null)
  })

  test('clearError only clears error', () => {
    useTranslateStore.setState({
      cypherResult: 'MATCH (n) RETURN n',
      error: 'Some error',
    })

    useTranslateStore.getState().clearError()

    const state = useTranslateStore.getState()
    expect(state.cypherResult).toBe('MATCH (n) RETURN n')
    expect(state.error).toBe(null)
  })

  test('clearHistory removes all history items', () => {
    const mockHistory: QueryHistory[] = [
      {
        query_id: 1,
        user_id: 1,
        neo4j_connection_id: 1,
        sql_query: 'SELECT * FROM users',
        cypher_query: 'MATCH (n:User) RETURN n',
        status: 'traducido',
        error_message: null,
        traduction_time: 15,
        execution_time: null,
        nodes_affected: null,
        created_at: new Date().toISOString(),
      },
      {
        query_id: 2,
        user_id: 1,
        neo4j_connection_id: 1,
        sql_query: 'SELECT * FROM products',
        cypher_query: 'MATCH (n:Product) RETURN n',
        status: 'ejecutado',
        error_message: null,
        traduction_time: 20,
        execution_time: 30,
        nodes_affected: 5,
        created_at: new Date().toISOString(),
      },
    ]

    useTranslateStore.setState({ history: mockHistory })

    useTranslateStore.getState().clearHistory()

    const state = useTranslateStore.getState()
    expect(state.history).toEqual([])
  })
})
