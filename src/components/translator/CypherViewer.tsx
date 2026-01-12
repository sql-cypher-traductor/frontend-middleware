'use client'

import { Button } from '@/components/ui/Button'
import Editor from '@monaco-editor/react'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CypherViewerProps {
  value: string
  height?: string
  metadata?: {
    query_type?: string
    tables_detected?: string[]
    complexity_score?: number
  } | null
  warnings?: string[]
}

export function CypherViewer({
  value,
  height = '400px',
  metadata,
  warnings = [],
}: CypherViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error al copiar:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header con botón copiar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Consulta Cypher</h3>
          {metadata?.query_type && (
            <span className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-400 rounded-md border border-green-500/20">
              {metadata.query_type}
            </span>
          )}
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={!value}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </Button>
      </div>

      {/* Editor de solo lectura */}
      <div className="rounded-lg border border-gray-700 overflow-hidden bg-gray-900">
        <Editor
          height={height}
          defaultLanguage="cypher"
          theme="vs-dark"
          value={value || '-- La consulta traducida aparecerá aquí'}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'none',
            contextmenu: false,
          }}
        />
      </div>

      {/* Metadata */}
      {metadata && (metadata.tables_detected || metadata.complexity_score) && (
        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Información de traducción</h4>
          <div className="space-y-2 text-sm text-gray-400">
            {metadata.tables_detected && metadata.tables_detected.length > 0 && (
              <div>
                <span className="font-medium text-gray-300">Tablas detectadas:</span>{' '}
                {metadata.tables_detected.join(', ')}
              </div>
            )}
            {metadata.complexity_score !== undefined && (
              <div>
                <span className="font-medium text-gray-300">Complejidad:</span>{' '}
                <span
                  className={
                    metadata.complexity_score < 3
                      ? 'text-green-400'
                      : metadata.complexity_score < 7
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }
                >
                  {metadata.complexity_score}/10
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <h4 className="text-sm font-medium text-yellow-400 mb-2">⚠️ Advertencias</h4>
          <ul className="space-y-1 text-sm text-yellow-300/80">
            {warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
