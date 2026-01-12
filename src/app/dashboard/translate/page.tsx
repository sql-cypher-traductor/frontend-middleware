'use client'

import { CypherViewer } from '@/components/translator/CypherViewer'
import { SQLEditor } from '@/components/translator/SQLEditor'
import { Button } from '@/components/ui/Button'
import { translateQuerySchema } from '@/lib/validations'
import { useConnectionStore } from '@/store/useConnectionStore'
import { useTranslateStore } from '@/store/useTranslateStore'
import { AlertCircle, ArrowRight, Clock, Database, Loader2, Play, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function TranslatePage() {
  const {
    sqlQuery,
    currentQueryId,
    cypherResult,
    metadata,
    warnings,
    traductionTime,
    status,
    isTranslating,
    isExecuting,
    error,
    selectedConnectionId,
    setSqlQuery,
    translateQuery,
    executeQuery,
    clearResult,
    setSelectedConnectionId,
    clearError,
  } = useTranslateStore()

  const { connections, fetchConnections } = useConnectionStore()
  const [validationError, setValidationError] = useState<string | null>(null)

  // Cargar conexiones al montar
  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  // Filtrar solo conexiones Neo4j
  const neo4jConnections = connections.filter((conn) => conn.db_type === 'neo4j')

  const handleTranslate = async () => {
    // Limpiar errores previos
    clearError()
    setValidationError(null)

    // Validar con Zod antes de enviar
    const validation = translateQuerySchema.safeParse({
      sql_query: sqlQuery,
      neo4j_connection_id: selectedConnectionId,
    })

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      setValidationError(firstError.message)
      toast.error('Validación fallida', {
        description: firstError.message,
      })
      return
    }

    try {
      const response = await translateQuery({
        sql_query: sqlQuery,
        neo4j_connection_id: selectedConnectionId!,
      })
      toast.success('Traducción exitosa', {
        description: `Completada en ${response.traduction_time.toFixed(2)}ms`,
      })
    } catch (error) {
      toast.error('Error en la traducción', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      })
    }
  }

  const handleExecute = async () => {
    if (!currentQueryId) return

    try {
      const response = await executeQuery({ query_id: currentQueryId })
      toast.success('Ejecución exitosa', {
        description: `${response.nodes_affected} nodos afectados en ${response.execution_time.toFixed(2)}ms`,
      })
    } catch (error) {
      toast.error('Error en la ejecución', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      })
    }
  }

  const handleClear = () => {
    setSqlQuery('')
    clearResult()
    clearError()
    setValidationError(null)
  }

  const isQueryEmpty = !sqlQuery.trim()
  const canTranslate = !isQueryEmpty && selectedConnectionId !== null
  const canExecute = currentQueryId !== null && status === 'traducido'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-500" />
            Traductor SQL → Cypher
          </h1>
          <p className="mt-2 text-gray-400">
            Traduce consultas SQL a Cypher para Neo4j de forma automática
          </p>
        </div>
        <Button onClick={handleClear} variant="outline" disabled={isQueryEmpty && !cypherResult}>
          Limpiar
        </Button>
      </div>

      {/* Selector de conexión Neo4j */}
      <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
        <div className="flex items-center gap-4">
          <Database className="w-5 h-5 text-blue-400" />
          <div className="flex-1">
            <label htmlFor="connection" className="block text-sm font-medium text-gray-300 mb-2">
              Conexión Neo4j de destino
            </label>
            <select
              id="connection"
              value={selectedConnectionId || ''}
              onChange={(e) => setSelectedConnectionId(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una conexión Neo4j</option>
              {neo4jConnections.map((conn) => (
                <option key={conn.connection_id} value={conn.connection_id}>
                  {conn.conn_name} ({conn.host}:{conn.port})
                </option>
              ))}
            </select>
          </div>
        </div>
        {neo4jConnections.length === 0 && (
          <p className="mt-2 text-sm text-yellow-400">
            ⚠️ No tienes conexiones Neo4j configuradas. Ve a Conexiones para crear una.
          </p>
        )}
      </div>

      {/* Grid de editores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor SQL */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Consulta SQL</h2>
            <span className="text-sm text-gray-500">{sqlQuery.length}/10000 caracteres</span>
          </div>
          <SQLEditor
            value={sqlQuery}
            onChange={setSqlQuery}
            height="500px"
            placeholder="SELECT * FROM users WHERE age > 25"
          />

          {/* Botones de acción */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleTranslate}
              disabled={!canTranslate || isTranslating}
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traduciendo...
                </>
              ) : (
                <>
                  Traducir
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            {/* Botón ejecutar (solo si hay traducción exitosa) */}
            {canExecute && (
              <Button
                onClick={handleExecute}
                disabled={isExecuting}
                size="lg"
                variant="secondary"
                className="w-full gap-2"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Ejecutar en Neo4j
                  </>
                )}
              </Button>
            )}

            {/* Estadísticas de traducción */}
            {traductionTime !== null && status && (
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Tiempo de traducción:</span>
                  </div>
                  <span className="font-medium text-white">{traductionTime.toFixed(2)}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-300">Estado:</span>
                  <span
                    className={`font-medium ${
                      status === 'traducido'
                        ? 'text-green-400'
                        : status === 'ejecutado'
                          ? 'text-blue-400'
                          : 'text-red-400'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>
            )}

            {/* Error de validación */}
            {validationError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{validationError}</p>
              </div>
            )}

            {/* Error de traducción */}
            {error && !validationError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Visor de Cypher */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Resultado Cypher</h2>
          <CypherViewer
            value={cypherResult || ''}
            height="500px"
            metadata={metadata}
            warnings={warnings}
          />
        </div>
      </div>

      {/* Info de seguridad */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-blue-300">
            <p className="font-medium">Medidas de seguridad activas:</p>
            <ul className="space-y-1 text-blue-300/80">
              <li>✓ Validación de sintaxis SQL básica</li>
              <li>✓ Detección de patrones de SQL injection</li>
              <li>✓ Sanitización contra XSS</li>
              <li>✓ Límite de 10,000 caracteres</li>
              <li>✓ Detección de comandos peligrosos encadenados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
