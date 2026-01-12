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
  const { connections, isLoading, error, fetchConnections, deleteConnection, clearError } =
    useConnectionStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  <p className="text-3xl font-bold text-gray-900">
                    {connections.filter((c) => c.db_type === 'sql_server').length}
                  </p>
                </CardContent>
              </Card>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-600">Neo4j</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {connections.filter((c) => c.db_type === 'neo4j').length}
                  </p>
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
    </div>
  )
}
