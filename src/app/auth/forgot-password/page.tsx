'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { AxiosErrorResponse, PasswordResetRequest } from '@/lib/api-types'
import { apiClient } from '@/lib/axios'
import { forgotPasswordSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const payload: PasswordResetRequest = {
        email: data.email,
      }

      await apiClient.post('/auth/password-reset/request', payload)

      setEmailSent(true)
      toast.success('Email enviado', {
        description: 'Revisa tu correo para restablecer tu contraseña.',
      })
    } catch (error: unknown) {
      const message =
        (error as AxiosErrorResponse).response?.data?.detail || 'Error al enviar email'
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
            <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription>
              {emailSent
                ? 'Revisa tu correo electrónico'
                : 'Ingresa tu email para restablecer tu contraseña'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Email enviado</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Hemos enviado un enlace para restablecer tu contraseña a tu correo
                          electrónico. Por favor revisa tu bandeja de entrada (y spam) y sigue las
                          instrucciones.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500">
                    ← Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    error={errors.email?.message}
                    helperText="Ingresa el email asociado a tu cuenta"
                    {...register('email')}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Enviar enlace de restablecimiento
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
