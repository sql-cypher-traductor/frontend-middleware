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

/**
 * Página de registro de usuario - HU AUM-01 T06
 *
 * Criterios de aceptación:
 * - Formulario con campos: nombre, apellido, email, contraseña y confirmación
 * - Validación de campos obligatorios y formato
 * - Redirección a login tras registro exitoso
 * - Mensajes de error para campos inválidos o email duplicado
 */
export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur', // Validar al perder foco para mejor UX
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      // Preparar payload según API del backend
      const payload: RegisterRequest = {
        name: data.name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
      }

      await apiClient.post('/auth/register', payload)

      toast.success('¡Registro exitoso!', {
        description: 'Tu cuenta ha sido creada. Por favor inicia sesión.',
        duration: 5000,
      })

      // Redireccionar a login según criterios de aceptación
      router.push('/auth/login')
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorResponse
      const message = axiosError.response?.data?.detail || 'Error al registrar usuario'

      toast.error('Error de registro', {
        description: message,
        duration: 5000,
      })
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
            <CardTitle>Crear cuenta</CardTitle>
            <CardDescription>Completa el formulario para registrarte en el sistema</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Campo Nombre */}
              <Input
                label="Nombre"
                type="text"
                placeholder="Juan"
                autoComplete="given-name"
                error={errors.name?.message}
                {...register('name')}
                required
                aria-describedby={errors.name ? 'name-error' : undefined}
              />

              {/* Campo Apellido */}
              <Input
                label="Apellido"
                type="text"
                placeholder="Pérez"
                autoComplete="family-name"
                error={errors.last_name?.message}
                {...register('last_name')}
                required
                aria-describedby={errors.last_name ? 'last_name-error' : undefined}
              />

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
                autoComplete="new-password"
                error={errors.password?.message}
                helperText="Mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos"
                {...register('password')}
                required
                aria-describedby={errors.password ? 'password-error' : 'password-helper'}
              />

              {/* Campo Confirmar Contraseña */}
              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                required
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />

              {/* Botón de envío */}
              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Crear cuenta'}
              </Button>
            </form>

            {/* Link a login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer con info de seguridad */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Al registrarte, serás asignado como usuario desarrollador por defecto.
        </p>
      </div>
    </div>
  )
}
