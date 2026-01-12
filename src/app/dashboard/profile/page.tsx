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

export default function ProfilePage() {
  const router = useRouter()
  const { user: storeUser, updateUser } = useAuthStore()
  const [user, setUser] = useState<User | null>(storeUser)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true)
      try {
        const response = await apiClient.get<User>('/users/me')
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
                  Nombre de usuario
                </label>
                <p className="text-gray-900">{user?.username}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                  {user?.role}
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
                  Última actualización
                </label>
                <p className="text-gray-900">
                  {user?.updated_at
                    ? new Date(user.updated_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
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
