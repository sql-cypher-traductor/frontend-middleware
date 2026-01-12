import { render, screen } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { Input } from '@/components/ui/Input'

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeDefined()
  })

  test('shows required asterisk when required', () => {
    render(<Input label="Password" required />)
    expect(screen.getByText('*')).toBeDefined()
  })

  test('displays error message', () => {
    render(<Input label="Email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeDefined()
  })

  test('displays helper text', () => {
    render(<Input label="Email" helperText="Enter your email address" />)
    expect(screen.getByText('Enter your email address')).toBeDefined()
  })

  test('applies error styles when error exists', () => {
    const { container } = render(<Input error="Invalid" data-testid="test-input" />)
    const input = container.querySelector('input')
    expect(input?.className).toContain('border-red-500')
  })
})
