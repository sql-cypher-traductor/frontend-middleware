'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { AxiosErrorResponse, LoginRequest, LoginResponse } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { loginSchema } from '@/lib/validations'
import { useAuthStore } from '@/store/useAuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const payload: LoginRequest = {
        email: data.email,
        password: data.password,
      }

      const response = await apiClient.post<LoginResponse>('/auth/login', payload)
      const { access_token, user } = response.data

      login(user, access_token)

      toast.success('¡Bienvenido!', {
        description: `Has iniciado sesión como ${user.username}`,
      })

      router.push('/dashboard')
    } catch (error: unknown) {
      const message =
        (error as AxiosErrorResponse).response?.data?.detail || 'Error al iniciar sesión'
      toast.error('Error de autenticación', {
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
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
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
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
                required
              />

              <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                Iniciar sesión
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
