import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

function submitForm() {
  const form = screen.getByRole('button', { name: /generate agreement/i }).closest('form')!
  const purposeInput = form.querySelector('#purpose') as HTMLInputElement
  fireEvent.change(purposeInput, { target: { value: 'Test purpose' } })
  fireEvent.submit(form)
}

describe('Home page', () => {
  it('renders NdaForm by default', () => {
    render(<Home />)
    expect(screen.getByText(/mutual nda/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /generate agreement/i })).toBeDefined()
  })

  it('switches to NdaDocument after form submit', () => {
    render(<Home />)
    submitForm()
    expect(screen.getByRole('heading', { name: /mutual non-disclosure agreement/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /edit/i })).toBeDefined()
  })

  it('passes submitted data to NdaDocument', () => {
    render(<Home />)
    submitForm()
    expect(screen.getByText('Test purpose')).toBeDefined()
  })

  it('returns to form when Edit is clicked', () => {
    render(<Home />)
    submitForm()
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(screen.getByRole('button', { name: /generate agreement/i })).toBeDefined()
  })
})
