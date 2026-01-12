import type {
  ExecuteQueryRequest,
  ExecuteQueryResponse,
  QueryHistory,
  TranslateRequest,
  TranslateResponse,
} from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { create } from 'zustand'

interface TranslateState {
  // Estado actual
  sqlQuery: string
  currentQueryId: number | null
  cypherResult: string | null
  metadata: TranslateResponse['metadata'] | null
  warnings: string[]
  traductionTime: number | null
  status: TranslateResponse['status'] | null

  // UI state
  isTranslating: boolean
  isExecuting: boolean
  error: string | null

  // Historial (se obtiene del backend)
  history: QueryHistory[]
  isLoadingHistory: boolean

  // Conexión Neo4j seleccionada (requerida)
  selectedConnectionId: number | null

  // Actions
  setSqlQuery: (query: string) => void
  translateQuery: (request: TranslateRequest) => Promise<TranslateResponse>
  executeQuery: (request: ExecuteQueryRequest) => Promise<ExecuteQueryResponse>
  fetchHistory: () => Promise<void>
  clearResult: () => void
  clearHistory: () => void
  setSelectedConnectionId: (id: number | null) => void
  clearError: () => void
}

export const useTranslateStore = create<TranslateState>((set, get) => ({
  // Estado inicial
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

  // Setters
  setSqlQuery: (query: string) => {
    set({ sqlQuery: query, error: null })
  },

  translateQuery: async (request: TranslateRequest): Promise<TranslateResponse> => {
    set({ isTranslating: true, error: null })

    try {
      const response = await apiClient.post<TranslateResponse>('/translate', request)

      set({
        currentQueryId: response.data.query_id,
        cypherResult: response.data.cypher_query,
        metadata: response.data.metadata || null,
        warnings: response.data.warnings || [],
        traductionTime: response.data.traduction_time,
        status: response.data.status,
        isTranslating: false,
        error: response.data.error_message || null,
      })

      // Recargar historial después de traducir
      get().fetchHistory()

      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al traducir la consulta'

      set({
        error: errorMessage,
        isTranslating: false,
        cypherResult: null,
        metadata: null,
        warnings: [],
        currentQueryId: null,
        status: 'fallido',
      })

      throw error
    }
  },

  executeQuery: async (request: ExecuteQueryRequest): Promise<ExecuteQueryResponse> => {
    set({ isExecuting: true, error: null })

    try {
      const response = await apiClient.post<ExecuteQueryResponse>(
        `/queries/${request.query_id}/execute`,
        request
      )

      // Actualizar estado con resultados de ejecución
      set({
        status: response.data.status,
        isExecuting: false,
        error: response.data.error_message || null,
      })

      // Recargar historial
      get().fetchHistory()

      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al ejecutar la consulta'

      set({
        error: errorMessage,
        isExecuting: false,
        status: 'fallido',
      })

      throw error
    }
  },

  fetchHistory: async (): Promise<void> => {
    set({ isLoadingHistory: true })

    try {
      const response = await apiClient.get<QueryHistory[]>('/queries/history')
      set({
        history: response.data,
        isLoadingHistory: false,
      })
    } catch (error) {
      console.error('Error al cargar historial:', error)
      set({ isLoadingHistory: false })
    }
  },

  clearResult: () => {
    set({
      currentQueryId: null,
      cypherResult: null,
      metadata: null,
      warnings: [],
      traductionTime: null,
      status: null,
      error: null,
    })
  },

  clearHistory: () => {
    set({ history: [] })
  },

  setSelectedConnectionId: (id: number | null) => {
    set({ selectedConnectionId: id })
  },

  clearError: () => {
    set({ error: null })
  },
}))
