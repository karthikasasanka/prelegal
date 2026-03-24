import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { NdaForm } from './NdaForm'
import type { NdaFormData } from '../types/nda'

afterEach(cleanup)

describe('NdaForm', () => {
  it('renders all major sections', () => {
    render(<NdaForm onSubmit={vi.fn()} />)
    expect(screen.getByText('Mutual NDA')).toBeDefined()
    expect(screen.getByText('Agreement Terms')).toBeDefined()
    expect(screen.getByText('Parties')).toBeDefined()
    expect(screen.getByRole('button', { name: /generate agreement/i })).toBeDefined()
  })

  it('calls onSubmit with form data on submit', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    fireEvent.submit(container.querySelector('form')!)
    expect(onSubmit).toHaveBeenCalledOnce()
    const data: NdaFormData = onSubmit.mock.calls[0][0]
    expect(data).toHaveProperty('purpose')
    expect(data).toHaveProperty('party1')
    expect(data).toHaveProperty('party2')
    expect(data.mndaTerm).toEqual({ type: 'perpetual' })
    expect(data.confidentialityTerm).toEqual({ type: 'perpetual' })
  })

  it('updates purpose field on change', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    const input = screen.getByPlaceholderText('Purpose of disclosure')
    fireEvent.change(input, { target: { value: 'Joint venture evaluation' } })
    fireEvent.submit(container.querySelector('form')!)
    const data: NdaFormData = onSubmit.mock.calls[0][0]
    expect(data.purpose).toBe('Joint venture evaluation')
  })

  it('switches mndaTerm to expires when radio selected', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    const radios = screen.getAllByRole('radio')
    // radios order: mndaTerm[perpetual], mndaTerm[expires], confidentialityTerm[perpetual], confidentialityTerm[expires]
    fireEvent.click(radios[1])
    fireEvent.submit(container.querySelector('form')!)
    const data: NdaFormData = onSubmit.mock.calls[0][0]
    expect(data.mndaTerm.type).toBe('expires')
  })
})
