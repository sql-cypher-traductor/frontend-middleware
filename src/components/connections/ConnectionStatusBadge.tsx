import type { Connection } from '@/lib/api-types'

interface ConnectionStatusBadgeProps {
  connection: Connection
  isTestLoading?: boolean
}

export function ConnectionStatusBadge({
  connection,
  isTestLoading = false,
}: ConnectionStatusBadgeProps) {
  // Si está probando, mostrar estado de carga
  if (isTestLoading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Probando...
      </span>
    )
  }

  // Determinar estado basado en is_active
  const isActive = connection.is_active ?? false

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Activa
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
      <span className="h-2 w-2 rounded-full bg-red-500" />
      Inactiva
    </span>
  )
}
