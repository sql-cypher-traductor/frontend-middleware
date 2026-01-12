import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import HomePage from '@/app/page'

describe('Home Page', () => {
  test('renders landing page title', () => {
    render(<HomePage />)
    expect(screen.getAllByText('Frontend Middleware')[0]).toBeDefined()
  })

  test('renders subtitle', () => {
    render(<HomePage />)
    expect(screen.getAllByText('SQL to Cypher Translator')[0]).toBeDefined()
  })

  test('renders login button', () => {
    render(<HomePage />)
    expect(screen.getAllByText('Iniciar sesión')[0]).toBeDefined()
  })

  test('renders register button', () => {
    render(<HomePage />)
    expect(screen.getAllByText('Crear cuenta')[0]).toBeDefined()
  })

  test('renders feature cards', () => {
    render(<HomePage />)
    expect(screen.getAllByText('Autenticación Segura')[0]).toBeDefined()
    expect(screen.getAllByText('Traducción Eficiente')[0]).toBeDefined()
    expect(screen.getAllByText('Gestión Completa')[0]).toBeDefined()
  })
})
