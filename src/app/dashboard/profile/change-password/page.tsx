'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { AxiosErrorResponse, ChangePasswordRequest } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { changePasswordSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true)
    try {
      const payload: ChangePasswordRequest = {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      }

      await apiClient.put('/users/me/password', payload)

      toast.success('¡Contraseña actualizada!', {
        description: 'Tu contraseña ha sido cambiada correctamente.',
      })

      reset()
      router.push('/dashboard/profile')
    } catch (error: unknown) {
      const message =
        (error as AxiosErrorResponse).response?.data?.detail || 'Error al cambiar contraseña'
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
          <h1 className="text-3xl font-bold text-gray-900">Cambiar Contraseña</h1>
          <p className="text-gray-600 mt-1">Actualiza tu contraseña de forma segura</p>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard/profile')}>
          ← Volver
        </Button>
      </div>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Nueva Contraseña</CardTitle>
          <CardDescription>Ingresa tu contraseña actual y la nueva contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              placeholder="••••••••"
              error={errors.oldPassword?.message}
              {...register('oldPassword')}
              required
            />

            <Input
              label="Nueva contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.newPassword?.message}
              helperText="Mínimo 8 caracteres, debe incluir mayúsculas, números y símbolos"
              {...register('newPassword')}
              required
            />

            <Input
              label="Confirmar nueva contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                Cambiar contraseña
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
