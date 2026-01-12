'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Página principal del Dashboard
 *
 * Muestra el menú principal tras inicio de sesión exitoso
 * según los criterios de aceptación de HU AUM-01
 */
export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada', {
      description: 'Has cerrado sesión correctamente',
    })
    router.push('/auth/login')
  }

  // Nombre completo del usuario
  const fullName = user ? `${user.name} ${user.last_name}` : 'Usuario'

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header del Dashboard */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido, {fullName}!</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      {/* Grid de tarjetas del menú principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Perfil */}
        <Card variant="bordered" className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>👤 Mi Perfil</CardTitle>
            <CardDescription>Ver y editar tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm">
                <span className="font-medium">Nombre:</span> {fullName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Rol:</span>{' '}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    user?.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Desarrollador'}
                </span>
              </p>
            </div>
            <Link href="/dashboard/profile">
              <Button size="sm" className="w-full">
                Ver perfil completo
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tarjeta de Conexiones */}
        <Card variant="bordered" className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>🔗 Conexiones</CardTitle>
            <CardDescription>Gestionar conexiones de base de datos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Administra tus conexiones a bases de datos SQL Server y Neo4j.
            </p>
            <Link href="/dashboard/connections">
              <Button size="sm" variant="secondary" className="w-full">
                Ver conexiones
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tarjeta de Historial */}
        <Card variant="bordered" className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>📊 Historial</CardTitle>
            <CardDescription>Ver tus consultas anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Accede al historial de consultas SQL traducidas a Cypher.
            </p>
            <Link href="/dashboard/history">
              <Button size="sm" variant="secondary" className="w-full">
                Ver historial
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tarjeta de Administración (solo ADMIN) */}
        {user?.role === 'ADMIN' && (
          <Card variant="bordered" className="hover:shadow-lg transition-shadow border-purple-200">
            <CardHeader>
              <CardTitle>⚙️ Administración</CardTitle>
              <CardDescription>Panel de administración del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Gestiona usuarios y configuraciones del sistema.
              </p>
              <Link href="/dashboard/admin">
                <Button size="sm" variant="secondary" className="w-full">
                  Ir a admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
