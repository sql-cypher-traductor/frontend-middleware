import type {
  Connection,
  CreateConnectionRequest,
  DatabaseSchemaResponse,
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
  activeSqlConnectionId: number | null // ID de la conexión SQL Server activa
  activeNeo4jConnectionId: number | null // ID de la conexión Neo4j activa
  databaseSchema: DatabaseSchemaResponse | null // Esquema de la BD SQL Server

  // Acciones
  fetchConnections: () => Promise<void>
  createConnection: (data: CreateConnectionRequest) => Promise<Connection>
  updateConnection: (id: number, data: UpdateConnectionRequest) => Promise<Connection>
  deleteConnection: (id: number) => Promise<void>
  testConnection: (data: TestConnectionRequest) => Promise<TestConnectionResponse>
  testExistingConnection: (id: number) => Promise<TestConnectionResponse>
  getDatabaseSchema: (id: number) => Promise<DatabaseSchemaResponse>
  setSelectedConnection: (connection: Connection | null) => void
  setActiveConnection: (id: number | null, dbType: 'sql_server' | 'neo4j') => void
  clearError: () => void
  clearSchema: () => void
  // Helpers
  isConnectionActive: (id: number) => boolean
  getActiveConnectionByType: (dbType: 'sql_server' | 'neo4j') => Connection | undefined
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  connections: [],
  isLoading: false,
  error: null,
  selectedConnection: null,
  activeSqlConnectionId: null,
  activeNeo4jConnectionId: null,
  databaseSchema: null,

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
        // Si la conexión eliminada era la activa de SQL Server, desactivarla
        activeSqlConnectionId:
          state.activeSqlConnectionId === id ? null : state.activeSqlConnectionId,
        // Si la conexión eliminada era la activa de Neo4j, desactivarla
        activeNeo4jConnectionId:
          state.activeNeo4jConnectionId === id ? null : state.activeNeo4jConnectionId,
        databaseSchema: state.activeSqlConnectionId === id ? null : state.databaseSchema,
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
      // Usar el nuevo endpoint que prueba con la contraseña almacenada
      const response = await apiClient.post<TestConnectionResponse>(`/connections/${id}/test`)
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

  getDatabaseSchema: async (id: number): Promise<DatabaseSchemaResponse> => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<DatabaseSchemaResponse>(`/connections/${id}/schema`)
      set({
        databaseSchema: response.data,
        isLoading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: 'Error al obtener el esquema de la base de datos',
        isLoading: false,
      })
      throw error
    }
  },

  setSelectedConnection: (connection: Connection | null) => {
    set({ selectedConnection: connection })
  },

  setActiveConnection: (id: number | null, dbType: 'sql_server' | 'neo4j') => {
    if (dbType === 'sql_server') {
      set({
        activeSqlConnectionId: id,
        // Limpiar esquema si se desconecta SQL Server
        databaseSchema: id === null ? null : get().databaseSchema,
      })
    } else {
      set({
        activeNeo4jConnectionId: id,
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },

  clearSchema: () => {
    set({ databaseSchema: null })
  },

  isConnectionActive: (id: number): boolean => {
    const state = get()
    return state.activeSqlConnectionId === id || state.activeNeo4jConnectionId === id
  },

  getActiveConnectionByType: (dbType: 'sql_server' | 'neo4j'): Connection | undefined => {
    const state = get()
    const activeId =
      dbType === 'sql_server' ? state.activeSqlConnectionId : state.activeNeo4jConnectionId
    return state.connections.find((c) => c.connection_id === activeId)
  },
}))
