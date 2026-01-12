import { Button } from '@/components/ui/Button'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDefined()
  })

  test('renders primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button.className).toContain('bg-blue-600')
  })

  test('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button.className).toContain('bg-gray-200')
  })

  test('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByText('Cargando...')).toBeDefined()
  })

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })
})
