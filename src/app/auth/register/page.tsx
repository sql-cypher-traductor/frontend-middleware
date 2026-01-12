'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { AxiosErrorResponse, RegisterRequest } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { registerSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const payload: RegisterRequest = {
        email: data.email,
        username: data.username,
        password: data.password,
      }

      await apiClient.post('/auth/register', payload)

      toast.success('¡Registro exitoso!', {
        description: 'Tu cuenta ha sido creada. Por favor inicia sesión.',
      })

      router.push('/auth/login')
    } catch (error: unknown) {
      const message =
        (error as AxiosErrorResponse).response?.data?.detail || 'Error al registrar usuario'
      toast.error('Error de registro', {
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
            <CardTitle>Crear cuenta</CardTitle>
            <CardDescription>Ingresa tus datos para registrarte</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                error={errors.email?.message}
                {...register('email')}
                required
              />

              <Input
                label="Nombre de usuario"
                type="text"
                placeholder="usuario123"
                error={errors.username?.message}
                {...register('username')}
                required
              />

              <Input
                label="Contraseña"
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
                Registrarse
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
