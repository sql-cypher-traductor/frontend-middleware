import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Frontend Middleware</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">SQL to Cypher Translator</p>
          <p className="text-lg text-gray-600 mb-12">
            Traduce consultas SQL a Cypher (Neo4j) de forma intuitiva y eficiente
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link href="/auth/login">
              <Button size="lg">Iniciar sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">
                Crear cuenta
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Autenticación Segura</h3>
              <p className="text-gray-600">
                Sistema de autenticación robusto con JWT y roles de usuario
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Traducción Eficiente</h3>
              <p className="text-gray-600">
                Convierte tus consultas SQL a Cypher de manera rápida y precisa
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión Completa</h3>
              <p className="text-gray-600">
                Administra conexiones, historial y consultas desde un solo lugar
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-300">
            <p className="text-gray-600">
              Desarrollado por el equipo de{' '}
              <span className="font-semibold">sql-cypher-traductor</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
