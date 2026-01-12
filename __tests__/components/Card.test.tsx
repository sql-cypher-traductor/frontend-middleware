import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

describe('Card Component', () => {
  test('renders card with content', () => {
    render(
      <Card>
        <CardContent>Test Content</CardContent>
      </Card>
    )
    expect(screen.getByText('Test Content')).toBeDefined()
  })

  test('renders card with header and title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Card Title')).toBeDefined()
  })

  test('renders card with description', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Card Description')).toBeDefined()
  })

  test('applies bordered variant class', () => {
    const { container } = render(<Card variant="bordered">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border')
  })

  test('applies elevated variant class', () => {
    const { container } = render(<Card variant="elevated">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('shadow-lg')
  })
})
