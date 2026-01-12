'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type {
  Connection,
  CreateConnectionRequest,
  DbType,
  UpdateConnectionRequest,
} from '@/lib/api-types'
import { createConnectionSchema } from '@/lib/validations'
import { useConnectionStore } from '@/store/useConnectionStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  connection?: Connection | null
  onSuccess?: () => void
}

interface ConnectionFormData {
  conn_name: string
  db_type: DbType
  host: string
  port: number
  db_user: string
  db_password: string
  database?: string
}

export function ConnectionModal({ isOpen, onClose, connection, onSuccess }: ConnectionModalProps) {
  const { createConnection, updateConnection, testConnection } = useConnectionStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [selectedDbType, setSelectedDbType] = useState<DbType>('sql_server')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(createConnectionSchema),
    defaultValues: {
      db_type: 'sql_server',
      port: 1433,
    },
  })

  const dbType = watch('db_type')

  // Actualizar estado local cuando cambia el tipo de DB
  useEffect(() => {
    setSelectedDbType(dbType)
  }, [dbType])

  // Cargar datos de conexión existente al editar
  useEffect(() => {
    if (connection && isOpen) {
      reset({
        conn_name: connection.conn_name,
        db_type: connection.db_type,
        host: connection.host,
        port: connection.port,
        db_user: connection.db_user,
        db_password: '', // No cargar la contraseña por seguridad
        database: '',
      })
      setSelectedDbType(connection.db_type)
    } else if (isOpen) {
      reset({
        conn_name: '',
        db_type: 'sql_server',
        host: '',
        port: 1433,
        db_user: '',
        db_password: '',
        database: '',
      })
      setSelectedDbType('sql_server')
    }
  }, [connection, isOpen, reset])

  // Cambiar puerto por defecto según tipo de DB
  const handleDbTypeChange = (newDbType: DbType) => {
    setSelectedDbType(newDbType)
    setValue('db_type', newDbType)
    if (newDbType === 'sql_server') {
      setValue('port', 1433)
    } else {
      setValue('port', 7687)
    }
  }

  const onSubmit = async (data: ConnectionFormData) => {
    setIsSubmitting(true)
    try {
      if (connection) {
        // Actualizar conexión existente
        const updateData: UpdateConnectionRequest = {
          conn_name: data.conn_name,
          host: data.host,
          port: data.port,
          db_user: data.db_user,
          database: data.database,
        }
        // Solo incluir contraseña si se proporcionó una nueva
        if (data.db_password) {
          updateData.db_password = data.db_password
        }
        await updateConnection(connection.connection_id, updateData)
        toast.success('Conexión actualizada exitosamente')
      } else {
        // Crear nueva conexión
        const createData: CreateConnectionRequest = {
          conn_name: data.conn_name,
          db_type: data.db_type,
          host: data.host,
          port: data.port,
          db_user: data.db_user,
          db_password: data.db_password,
          database: data.database,
        }
        await createConnection(createData)
        toast.success('Conexión creada exitosamente')
      }
      onSuccess?.()
      onClose()
      reset()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error(connection ? 'Error al actualizar' : 'Error al crear', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTestConnection = async () => {
    const formData = watch()

    // Validar campos obligatorios antes de probar
    if (!formData.host || !formData.port || !formData.db_user || !formData.db_password) {
      toast.error('Completa todos los campos obligatorios', {
        description: 'Host, Puerto, Usuario y Contraseña son requeridos',
      })
      return
    }

    setIsTesting(true)
    try {
      const result = await testConnection({
        db_type: formData.db_type,
        host: formData.host,
        port: formData.port,
        db_user: formData.db_user,
        db_password: formData.db_password,
        database: formData.database,
      })

      if (result.success) {
        toast.success('¡Conexión exitosa!', {
          description: `Latencia: ${result.latency_ms}ms - ${result.message}`,
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
      setIsTesting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {connection ? 'Editar Conexión' : 'Nueva Conexión'}
            </h2>
            <button
              onClick={onClose}
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nombre de conexión */}
            <Input
              label="Nombre de la conexión"
              type="text"
              {...register('conn_name')}
              error={errors.conn_name?.message}
              placeholder="Mi conexión de producción"
              required
            />

            {/* Tipo de base de datos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de base de datos <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleDbTypeChange('sql_server')}
                  disabled={!!connection} // Deshabilitar en edición
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedDbType === 'sql_server'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${connection ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <div className="text-2xl mb-2">🗄️</div>
                  <div className="font-medium">SQL Server</div>
                  <div className="text-xs text-gray-500 mt-1">Base de datos relacional</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDbTypeChange('neo4j')}
                  disabled={!!connection}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedDbType === 'neo4j'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${connection ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="font-medium">Neo4j</div>
                  <div className="text-xs text-gray-500 mt-1">Base de datos de grafos</div>
                </button>
              </div>
              <input type="hidden" {...register('db_type')} />
              {errors.db_type && (
                <p className="mt-1 text-sm text-red-600">{errors.db_type.message}</p>
              )}
            </div>

            {/* Host y Puerto */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Host"
                type="text"
                {...register('host')}
                error={errors.host?.message}
                placeholder={selectedDbType === 'sql_server' ? 'localhost' : 'bolt://localhost'}
                required
              />
              <Input
                label="Puerto"
                type="number"
                {...register('port', { valueAsNumber: true })}
                error={errors.port?.message}
                placeholder={selectedDbType === 'sql_server' ? '1433' : '7687'}
                required
              />
            </div>

            {/* Base de datos (solo para SQL Server) */}
            {selectedDbType === 'sql_server' && (
              <Input
                label="Base de datos"
                type="text"
                {...register('database')}
                error={errors.database?.message}
                placeholder="master"
                helperText="Nombre de la base de datos a la que conectar"
              />
            )}

            {/* Usuario */}
            <Input
              label="Usuario"
              type="text"
              {...register('db_user')}
              error={errors.db_user?.message}
              placeholder={selectedDbType === 'sql_server' ? 'sa' : 'neo4j'}
              required
            />

            {/* Contraseña */}
            <Input
              label="Contraseña"
              type="password"
              {...register('db_password')}
              error={errors.db_password?.message}
              placeholder="●●●●●●●●"
              required={!connection}
              helperText={
                connection ? 'Deja en blanco para mantener la contraseña actual' : undefined
              }
            />

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestConnection}
                isLoading={isTesting}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isTesting ? 'Probando...' : 'Probar Conexión'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting || isTesting}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isTesting}>
                {isSubmitting ? 'Guardando...' : connection ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
