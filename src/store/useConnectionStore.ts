import type {
  Connection,
  CreateConnectionRequest,
  TestConnectionRequest,
  TestConnectionResponse,
  UpdateConnectionRequest,
} from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { create } from 'zustand'

interface ConnectionState {
  connections: Connection[]
  isLoading: boolean
  error: string | null
  selectedConnection: Connection | null

  // Acciones
  fetchConnections: () => Promise<void>
  createConnection: (data: CreateConnectionRequest) => Promise<Connection>
  updateConnection: (id: number, data: UpdateConnectionRequest) => Promise<Connection>
  deleteConnection: (id: number) => Promise<void>
  testConnection: (data: TestConnectionRequest) => Promise<TestConnectionResponse>
  testExistingConnection: (id: number) => Promise<TestConnectionResponse>
  setSelectedConnection: (connection: Connection | null) => void
  clearError: () => void
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  connections: [],
  isLoading: false,
  error: null,
  selectedConnection: null,

  fetchConnections: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Connection[]>('/connections')
      set({ connections: response.data, isLoading: false })
    } catch (error) {
      set({
        error: 'Error al cargar las conexiones',
        isLoading: false,
      })
      throw error
    }
  },

  createConnection: async (data: CreateConnectionRequest) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post<Connection>('/connections', data)
      set((state) => ({
        connections: [...state.connections, response.data],
        isLoading: false,
      }))
      return response.data
    } catch (error) {
      set({
        error: 'Error al crear la conexión',
        isLoading: false,
      })
      throw error
    }
  },

  updateConnection: async (id: number, data: UpdateConnectionRequest): Promise<Connection> => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.put<Connection>(`/connections/${id}`, data)
      set((state) => ({
        connections: state.connections.map((conn) =>
          conn.connection_id === id ? response.data : conn
        ),
        isLoading: false,
      }))
      return response.data
    } catch (error) {
      set({
        error: 'Error al actualizar la conexión',
        isLoading: false,
      })
      throw error
    }
  },

  deleteConnection: async (id: number): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.delete(`/connections/${id}`)
      set((state) => ({
        connections: state.connections.filter((conn) => conn.connection_id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: 'Error al eliminar la conexión',
        isLoading: false,
      })
      throw error
    }
  },

  testConnection: async (data: TestConnectionRequest): Promise<TestConnectionResponse> => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post<TestConnectionResponse>('/connections/test', data)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      set({
        error: 'Error al probar la conexión',
        isLoading: false,
      })
      throw error
    }
  },

  testExistingConnection: async (id: number): Promise<TestConnectionResponse> => {
    set({ isLoading: true, error: null })
    try {
      // Get connection data first
      const connection = useConnectionStore
        .getState()
        .connections.find((c) => c.connection_id === id)
      if (!connection) {
        throw new Error('Conexión no encontrada')
      }

      // Use the general test endpoint with connection data
      const testData: TestConnectionRequest = {
        db_type: connection.db_type,
        host: connection.host,
        port: connection.port,
        db_user: connection.db_user,
        db_password: '', // Password is encrypted in backend, user must provide it again for testing
        database_name: connection.database_name,
      }

      const response = await apiClient.post<TestConnectionResponse>('/connections/test', testData)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      set({
        error: 'Error al probar la conexión',
        isLoading: false,
      })
      throw error
    }
  },

  setSelectedConnection: (connection: Connection | null) => {
    set({ selectedConnection: connection })
  },

  clearError: () => {
    set({ error: null })
  },
}))
