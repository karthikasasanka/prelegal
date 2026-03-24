import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
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

  it('calls onSubmit with default form data on submit', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    fireEvent.submit(container.querySelector('form')!)
    expect(onSubmit).toHaveBeenCalledOnce()
    const data: NdaFormData = onSubmit.mock.calls[0][0]
    expect(data.purpose).toBe('')
    expect(data.party1).toEqual({ name: '', title: '', company: '', noticeAddress: '' })
    expect(data.mndaTerm).toEqual({ type: 'perpetual' })
    expect(data.confidentialityTerm).toEqual({ type: 'perpetual' })
  })

  it('updates purpose field on change', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Purpose'), { target: { value: 'Joint venture evaluation' } })
    fireEvent.submit(container.querySelector('form')!)
    expect((onSubmit.mock.calls[0][0] as NdaFormData).purpose).toBe('Joint venture evaluation')
  })

  it('updates party1 name field on change', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    const nameInputs = screen.getAllByPlaceholderText('Full name')
    fireEvent.change(nameInputs[0], { target: { value: 'Alice Smith' } })
    fireEvent.submit(container.querySelector('form')!)
    expect((onSubmit.mock.calls[0][0] as NdaFormData).party1.name).toBe('Alice Smith')
  })

  it('switches mndaTerm to expires and sets years', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    const mndaGroup = screen.getByText('MNDA Term').closest('div')!
    fireEvent.click(within(mndaGroup).getAllByRole('radio')[1])
    const yearsInput = within(mndaGroup).getByRole('spinbutton')
    fireEvent.change(yearsInput, { target: { value: '5' } })
    fireEvent.submit(container.querySelector('form')!)
    const data: NdaFormData = onSubmit.mock.calls[0][0]
    expect(data.mndaTerm).toEqual({ type: 'expires', years: 5 })
  })

  it('switches confidentialityTerm independently of mndaTerm', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    const confGroup = screen.getByText('Confidentiality Term').closest('div')!
    fireEvent.click(within(confGroup).getAllByRole('radio')[1])
    fireEvent.submit(container.querySelector('form')!)
    const data: NdaFormData = onSubmit.mock.calls[0][0]
    expect(data.confidentialityTerm.type).toBe('expires')
    expect(data.mndaTerm.type).toBe('perpetual')
  })

  it('clamps years to minimum 1', () => {
    const onSubmit = vi.fn()
    const { container } = render(<NdaForm onSubmit={onSubmit} />)
    const mndaGroup = screen.getByText('MNDA Term').closest('div')!
    fireEvent.click(within(mndaGroup).getAllByRole('radio')[1])
    fireEvent.change(within(mndaGroup).getByRole('spinbutton'), { target: { value: '0' } })
    fireEvent.submit(container.querySelector('form')!)
    const data: NdaFormData = onSubmit.mock.calls[0][0]
    expect((data.mndaTerm as { type: 'expires'; years: number }).years).toBeGreaterThanOrEqual(1)
  })
})
