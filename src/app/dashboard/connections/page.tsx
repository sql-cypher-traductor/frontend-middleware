'use client'

import { ConnectionCard } from '@/components/connections/ConnectionCard'
import { ConnectionModal } from '@/components/connections/ConnectionModal'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Connection } from '@/lib/api-types'
import { useConnectionStore } from '@/store/useConnectionStore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ConnectionsPage() {
  const {
    connections,
    isLoading,
    error,
    fetchConnections,
    deleteConnection,
    clearError,
    activeSqlConnectionId,
    activeNeo4jConnectionId,
    databaseSchema,
  } = useConnectionStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [showSchemaModal, setShowSchemaModal] = useState(false)

  useEffect(() => {
    fetchConnections().catch(() => {
      toast.error('Error al cargar las conexiones')
    })
  }, [fetchConnections])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleCreateNew = () => {
    setSelectedConnection(null)
    setIsModalOpen(true)
  }

  const handleEdit = (connection: Connection) => {
    setSelectedConnection(connection)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteConnection(id)
    } catch (error) {
      throw error
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedConnection(null)
  }

  const handleModalSuccess = () => {
    fetchConnections()
  }

  const handleViewSchema = () => {
    setShowSchemaModal(true)
  }

  // Obtener las conexiones activas
  const activeSqlConnection = connections.find((c) => c.connection_id === activeSqlConnectionId)
  const activeNeo4jConnection = connections.find((c) => c.connection_id === activeNeo4jConnectionId)
  const hasActiveConnection = activeSqlConnectionId !== null || activeNeo4jConnectionId !== null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Conexiones</h1>
              <p className="mt-2 text-gray-600">Administra tus conexiones a SQL Server y Neo4j</p>
            </div>
            <Button variant="primary" onClick={handleCreateNew}>
              + Nueva Conexión
            </Button>
          </div>
        </div>

        {/* Conexiones activas */}
        {hasActiveConnection && (
          <div className="mb-6 space-y-4">
            {activeSqlConnection && (
              <Card variant="bordered" className="border-blue-500 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <span className="animate-pulse">●</span>
                    Conexión SQL Server Activa: {activeSqlConnection.conn_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-700">
                      <span className="font-medium">SQL Server</span>
                      {' • '}
                      {activeSqlConnection.host}:{activeSqlConnection.port}
                      {activeSqlConnection.database_name &&
                        ` • ${activeSqlConnection.database_name}`}
                    </div>
                    {databaseSchema && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowSchemaModal(true)}
                      >
                        📋 Ver Esquema ({databaseSchema.tables.length} tablas)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {activeNeo4jConnection && (
              <Card variant="bordered" className="border-purple-500 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <span className="animate-pulse">●</span>
                    Conexión Neo4j Activa: {activeNeo4jConnection.conn_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-purple-700">
                    <span className="font-medium">Neo4j</span>
                    {' • '}
                    {activeNeo4jConnection.host}:{activeNeo4jConnection.port}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Estado de carga */}
        {isLoading && connections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-600">Cargando conexiones...</p>
          </div>
        )}

        {/* Sin conexiones */}
        {!isLoading && connections.length === 0 && (
          <Card variant="bordered" className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🔌</div>
              <CardTitle className="text-xl mb-2">No hay conexiones configuradas</CardTitle>
              <p className="text-gray-600 mb-6">
                Comienza creando tu primera conexión a una base de datos
              </p>
              <Button variant="primary" onClick={handleCreateNew}>
                Crear Primera Conexión
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lista de conexiones */}
        {connections.length > 0 && (
          <div>
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Total de Conexiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">{connections.length}</p>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">SQL Server</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    {connections.filter((c) => c.db_type === 'sql_server').length}
                  </p>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Neo4j</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">
                    {connections.filter((c) => c.db_type === 'neo4j').length}
                  </p>
                </CardContent>
              </Card>

              <Card variant="bordered" className={hasActiveConnection ? 'border-green-500' : ''}>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-bold ${activeSqlConnectionId ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      {activeSqlConnectionId ? '● SQL Server' : '○ SQL Server'}
                    </p>
                    <p
                      className={`text-sm font-bold ${activeNeo4jConnectionId ? 'text-purple-600' : 'text-gray-400'}`}
                    >
                      {activeNeo4jConnectionId ? '● Neo4j' : '○ Neo4j'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grid de tarjetas de conexiones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => (
                <ConnectionCard
                  key={connection.connection_id}
                  connection={connection}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewSchema={handleViewSchema}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de creación/edición */}
      <ConnectionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        connection={selectedConnection}
        onSuccess={handleModalSuccess}
      />

      {/* Modal de esquema de base de datos */}
      {showSchemaModal && databaseSchema && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSchemaModal(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  📋 Esquema de Base de Datos: {databaseSchema.database_name}
                </h2>
                <button
                  onClick={() => setShowSchemaModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {databaseSchema.tables.length} tablas • {databaseSchema.relationships.length}{' '}
                relaciones
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Tablas */}
              <div className="space-y-4">
                {databaseSchema.tables.map((table) => (
                  <Card key={`${table.schema_name}.${table.name}`} variant="bordered">
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>
                          🗄️ {table.schema_name}.{table.name}
                        </span>
                        {table.row_count !== null && (
                          <span className="text-sm font-normal text-gray-500">
                            ~{table.row_count?.toLocaleString()} filas
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Columna
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Tipo
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                PK
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                FK
                              </th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                Null
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {table.columns.map((col) => (
                              <tr key={col.name} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-900">{col.name}</td>
                                <td className="px-3 py-2 text-gray-600">
                                  {col.data_type}
                                  {col.max_length && col.max_length > 0 && `(${col.max_length})`}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {col.is_primary_key && (
                                    <span className="text-yellow-500" title="Primary Key">
                                      🔑
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {col.is_foreign_key && (
                                    <span
                                      className="text-blue-500 cursor-help"
                                      title={`FK → ${col.referenced_table}.${col.referenced_column}`}
                                    >
                                      🔗
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center text-gray-400">
                                  {col.is_nullable ? '✓' : '✗'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Relaciones */}
              {databaseSchema.relationships.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🔗 Relaciones ({databaseSchema.relationships.length})
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {databaseSchema.relationships.map((rel) => (
                        <div
                          key={rel.name}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="font-medium">{rel.source_table}</span>
                          <span className="text-gray-400">.</span>
                          <span>{rel.source_column}</span>
                          <span className="text-blue-500">→</span>
                          <span className="font-medium">{rel.target_table}</span>
                          <span className="text-gray-400">.</span>
                          <span>{rel.target_column}</span>
                          <span className="text-xs text-gray-400 ml-2">({rel.name})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Última actualización:{' '}
                  {new Date(databaseSchema.retrieved_at).toLocaleString('es-ES')}
                </p>
                <Button variant="secondary" onClick={() => setShowSchemaModal(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
