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
}

export function ConnectionCard({ connection, onEdit, onDelete }: ConnectionCardProps) {
  const [isTestLoading, setIsTestLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { testExistingConnection } = useConnectionStore()

  const handleTest = async () => {
    setIsTestLoading(true)
    try {
      const result = await testExistingConnection(connection.connection_id)
      if (result.success) {
        toast.success('Conexión exitosa', {
          description: `Latencia: ${result.latency_ms}ms`,
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
    <Card variant="bordered" className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dbTypeIcon}</span>
            <div>
              <CardTitle className="text-lg">{connection.conn_name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{dbTypeLabel}</p>
            </div>
          </div>
          <ConnectionStatusBadge connection={connection} isTestLoading={isTestLoading} />
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

        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTest}
            isLoading={isTestLoading}
            className="flex-1"
          >
            {isTestLoading ? 'Probando...' : 'Probar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(connection)}
            disabled={isTestLoading || isDeleting}
            className="flex-1"
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isTestLoading}
            className="flex-1"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
