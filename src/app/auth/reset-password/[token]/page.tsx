'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { AxiosErrorResponse, PasswordResetConfirm } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { resetPasswordSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Error', {
        description: 'Token de restablecimiento no válido',
      })
      return
    }

    setIsLoading(true)
    try {
      const payload: PasswordResetConfirm = {
        token: token,
        new_password: data.password,
      }

      await apiClient.post('/auth/password-reset/confirm', payload)

      toast.success('¡Contraseña restablecida!', {
        description: 'Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión.',
      })

      router.push('/auth/login')
    } catch (error: unknown) {
      const message =
        (error as AxiosErrorResponse).response?.data?.detail || 'Error al restablecer contraseña'
      toast.error('Error', {
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Frontend Middleware</h1>
          <p className="mt-2 text-sm text-gray-600">SQL to Cypher Translator</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Restablecer contraseña</CardTitle>
            <CardDescription>Ingresa tu nueva contraseña</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nueva contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                helperText="Mínimo 8 caracteres, debe incluir mayúsculas, números y símbolos"
                {...register('password')}
                required
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                required
              />

              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                Restablecer contraseña
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ← Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
