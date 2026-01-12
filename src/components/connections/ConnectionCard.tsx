'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Connection } from '@/lib/api-types'
import { useConnectionStore } from '@/store/useConnectionStore'
import { useState } from 'react'
import { toast } from 'sonner'

import { ConnectionStatusBadge } from './ConnectionStatusBadge'

interface ConnectionCardProps {
  connection: Connection
  onEdit: (connection: Connection) => void
  onDelete: (id: number) => void
  onViewSchema?: () => void
}

export function ConnectionCard({
  connection,
  onEdit,
  onDelete,
  onViewSchema,
}: ConnectionCardProps) {
  const [isTestLoading, setIsTestLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { testExistingConnection, isConnectionActive, setActiveConnection, getDatabaseSchema } =
    useConnectionStore()

  const isActive = isConnectionActive(connection.connection_id)

  const handleTest = async () => {
    setIsTestLoading(true)
    try {
      const result = await testExistingConnection(connection.connection_id)
      if (result.success) {
        toast.success('Conexión exitosa', {
          description: `Latencia: ${result.connection_time_ms}ms`,
        })
      } else {
        toast.error('Conexión fallida', {
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Error al probar conexión', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setIsTestLoading(false)
    }
  }

  const handleConnect = async () => {
    if (isActive) {
      // Desconectar
      setActiveConnection(null, connection.db_type)
      toast.info('Desconectado', {
        description: `Se desconectó de "${connection.conn_name}"`,
      })
      return
    }

    setIsConnecting(true)
    try {
      // Primero probar la conexión
      const result = await testExistingConnection(connection.connection_id)

      if (result.success) {
        setActiveConnection(connection.connection_id, connection.db_type)

        // Si es SQL Server, obtener el esquema
        if (connection.db_type === 'sql_server') {
          try {
            await getDatabaseSchema(connection.connection_id)
            toast.success('Conectado a SQL Server', {
              description: `Esquema de "${connection.database_name}" cargado correctamente`,
            })
          } catch {
            toast.warning('Conectado sin esquema', {
              description: 'No se pudo cargar el esquema de la base de datos',
            })
          }
        } else {
          toast.success('Conectado a Neo4j', {
            description: `Listo para ejecutar consultas Cypher`,
          })
        }
      } else {
        toast.error('No se pudo conectar', {
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Error al conectar', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar la conexión "${connection.conn_name}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(connection.connection_id)
      toast.success('Conexión eliminada exitosamente')
    } catch {
      toast.error('Error al eliminar conexión')
    } finally {
      setIsDeleting(false)
    }
  }

  // Formatear tipo de base de datos
  const dbTypeLabel = connection.db_type === 'sql_server' ? 'SQL Server' : 'Neo4j'
  const dbTypeIcon = connection.db_type === 'sql_server' ? '🗄️' : '🔗'

  return (
    <Card
      variant="bordered"
      className={`hover:shadow-md transition-all ${isActive ? 'ring-2 ring-green-500 border-green-500' : ''}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dbTypeIcon}</span>
            <div>
              <CardTitle className="text-lg">{connection.conn_name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{dbTypeLabel}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <ConnectionStatusBadge connection={connection} isTestLoading={isTestLoading} />
            {isActive && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                ● Activa
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Host:</dt>
            <dd className="font-medium text-gray-900">{connection.host}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Puerto:</dt>
            <dd className="font-medium text-gray-900">{connection.port}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Usuario:</dt>
            <dd className="font-medium text-gray-900">{connection.db_user}</dd>
          </div>
          {connection.db_type === 'sql_server' && connection.database_name && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Base de datos:</dt>
              <dd className="font-medium text-gray-900">{connection.database_name}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-gray-500">Creada:</dt>
            <dd className="font-medium text-gray-900">
              {new Date(connection.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </dd>
          </div>
        </dl>

        {/* Botón principal de conectar/desconectar */}
        <div className="mt-4">
          <Button
            variant={isActive ? 'danger' : 'primary'}
            size="sm"
            onClick={handleConnect}
            isLoading={isConnecting}
            disabled={isTestLoading || isDeleting}
            className="w-full"
          >
            {isConnecting ? 'Conectando...' : isActive ? '⏏ Desconectar' : '▶ Conectar'}
          </Button>
        </div>

        {/* Botones secundarios */}
        <div className="mt-2 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTest}
            isLoading={isTestLoading}
            disabled={isConnecting || isDeleting}
            className="flex-1"
          >
            {isTestLoading ? 'Probando...' : '🔍 Probar'}
          </Button>
          {connection.db_type === 'sql_server' && isActive && onViewSchema && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onViewSchema}
              disabled={isTestLoading || isConnecting || isDeleting}
              className="flex-1"
            >
              📋 Ver Esquema
            </Button>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(connection)}
            disabled={isTestLoading || isConnecting || isDeleting}
            className="flex-1"
          >
            ✏️ Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isTestLoading || isConnecting || isActive}
            className="flex-1"
          >
            {isDeleting ? 'Eliminando...' : '🗑️ Eliminar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
