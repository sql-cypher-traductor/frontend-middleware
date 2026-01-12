'use client'

import { useProtectedRoute } from '@/hooks/useProtectedRoute'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useProtectedRoute()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>
}
