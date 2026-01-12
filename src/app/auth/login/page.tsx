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

/**
 * Página de inicio de sesión - HU AUM-01 T08
 *
 * Criterios de aceptación:
 * - Formulario con campos: correo y contraseña
 * - Guardar JWT en localStorage tras login exitoso
 * - Redirección al dashboard principal
 * - Mensajes de error para credenciales inválidas (HTTP 401)
 */
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
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const payload: LoginRequest = {
        email: data.email.toLowerCase().trim(),
        password: data.password,
      }

      const response = await apiClient.post<LoginResponse>('/auth/login', payload)
      const { access_token, user } = response.data

      // Guardar token y datos del usuario en el store (y localStorage)
      login(user, access_token)

      // Mensaje de bienvenida personalizado
      toast.success('¡Bienvenido!', {
        description: `Has iniciado sesión como ${user.name} ${user.last_name}`,
        duration: 4000,
      })

      // Redireccionar al dashboard según criterios de aceptación
      router.push('/dashboard')
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse
      const statusCode = (error as { response?: { status?: number } }).response?.status

      // Manejo específico de error 401 según HU AUM-01 T03
      if (statusCode === 401) {
        toast.error('Credenciales inválidas', {
          description: 'El correo o la contraseña son incorrectos.',
          duration: 5000,
        })
      } else {
        const message = axiosError.response?.data?.detail || 'Error al iniciar sesión'
        toast.error('Error de autenticación', {
          description: message,
          duration: 5000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header de la aplicación */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SQL to Cypher</h1>
          <p className="mt-2 text-sm text-gray-600">Traductor de consultas SQL a Cypher</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Campo Email */}
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
                required
                aria-describedby={errors.email ? 'email-error' : undefined}
              />

              {/* Campo Contraseña */}
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
                required
                aria-describedby={errors.password ? 'password-error' : undefined}
              />

              {/* Link para recuperar contraseña */}
              <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de envío */}
              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            {/* Link a registro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer con info de seguridad */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Tu sesión expirará automáticamente por seguridad después de 24 horas.
        </p>
      </div>
    </div>
  )
}
