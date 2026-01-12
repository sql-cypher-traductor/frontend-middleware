'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import type { AxiosErrorResponse, User } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { useAuthStore } from '@/store/useAuthStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Página de perfil de usuario
 *
 * Muestra la información del usuario autenticado
 */
export default function ProfilePage() {
  const router = useRouter()
  const { user: storeUser, updateUser } = useAuthStore()
  const [user, setUser] = useState<User | null>(storeUser)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
        // Usar endpoint correcto del backend
        const response = await apiClient.get<User>('/auth/me')
        setUser(response.data)
        updateUser(response.data)
      } catch (error: unknown) {
        toast.error('Error al cargar perfil', {
          description:
            (error as AxiosErrorResponse).response?.data?.detail || 'No se pudo cargar tu perfil',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [updateUser])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  // Nombre completo del usuario
  const fullName = user ? `${user.name} ${user.last_name}` : 'Usuario'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">Información de tu cuenta</p>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          ← Volver al Dashboard
        </Button>
      </div>

      <div className="space-y-6">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Tus datos de usuario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <p className="text-gray-900">{fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <p className="text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <p className="text-gray-900">{user?.last_name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Desarrollador'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user?.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de registro
                </label>
                <p className="text-gray-900">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Último inicio de sesión
                </label>
                <p className="text-gray-900">
                  {user?.last_login
                    ? new Date(user.last_login).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Primera sesión'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/dashboard/profile/edit">
                <Button>Editar perfil</Button>
              </Link>
              <Link href="/dashboard/profile/change-password">
                <Button variant="secondary">Cambiar contraseña</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
