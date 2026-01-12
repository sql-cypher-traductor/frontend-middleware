'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { AxiosErrorResponse, UpdateUserRequest, User } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { updateProfileSchema } from '@/lib/validations'
import { useAuthStore } from '@/store/useAuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

/**
 * Página de edición de perfil
 *
 * Permite al usuario actualizar su nombre, apellido y email
 */
export default function EditProfilePage() {
  const router = useRouter()
  const { user, updateUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true)
    try {
      const payload: UpdateUserRequest = {
        name: data.name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.toLowerCase().trim(),
      }

      const response = await apiClient.put<User>('/auth/me', payload)

      updateUser(response.data)

      toast.success('¡Perfil actualizado!', {
        description: 'Tus datos han sido actualizados correctamente.',
      })

      router.push('/dashboard/profile')
    } catch (error: unknown) {
      const message =
        (error as AxiosErrorResponse).response?.data?.detail || 'Error al actualizar perfil'
      toast.error('Error al actualizar', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
          <p className="text-gray-600 mt-1">Actualiza tu información personal</p>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard/profile')}>
          ← Volver
        </Button>
      </div>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Modifica los campos que desees actualizar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Nombre"
              type="text"
              placeholder="Juan"
              autoComplete="given-name"
              error={errors.name?.message}
              {...register('name')}
              required
            />

            <Input
              label="Apellido"
              type="text"
              placeholder="Pérez"
              autoComplete="family-name"
              error={errors.last_name?.message}
              {...register('last_name')}
              required
            />

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/dashboard/profile')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
