import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Home page', () => {
  it('renders NdaForm by default', () => {
    render(<Home />)
    expect(screen.getByText(/mutual nda/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /generate agreement/i })).toBeDefined()
  })

  it('switches to NdaDocument after form submit', () => {
    render(<Home />)
    fireEvent.submit(screen.getByRole('button', { name: /generate agreement/i }).closest('form')!)
    expect(screen.getByRole('heading', { name: /mutual non-disclosure agreement/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /edit/i })).toBeDefined()
  })

  it('returns to form when Edit is clicked', () => {
    render(<Home />)
    fireEvent.submit(screen.getByRole('button', { name: /generate agreement/i }).closest('form')!)
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('button', { name: /generate agreement/i })).toBeDefined()
  })
})
