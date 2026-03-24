import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NdaDocument } from './NdaDocument'
import { NdaFormData } from '../types/nda'

const base: NdaFormData = {
  purpose: 'Exploring a potential partnership',
  effectiveDate: '2025-01-15',
  mndaTerm: { type: 'expires', years: 2 },
  confidentialityTerm: { type: 'perpetual' },
  governingLaw: 'Delaware',
  jurisdiction: 'New Castle, DE',
  party1: { name: 'Alice Smith', title: 'CEO', company: 'Acme Inc', noticeAddress: 'alice@acme.com' },
  party2: { name: 'Bob Jones', title: 'CTO', company: 'Globex LLC', noticeAddress: 'bob@globex.com' },
}

/** Returns the checkbox mark ('[x]' or '[ ]') for the CheckItem whose label matches `text`. */
function checkFor(text: RegExp | string): string {
  const label = screen.getByText(text)
  return label.parentElement!.querySelector('span')!.textContent!
}

describe('NdaDocument', () => {
  it('renders purpose and effective date', () => {
    render(<NdaDocument data={base} />)
    expect(screen.getByText('Exploring a potential partnership')).toBeTruthy()
    expect(screen.getByText('2025-01-15')).toBeTruthy()
  })

  it('renders governing law and jurisdiction', () => {
    render(<NdaDocument data={base} />)
    expect(screen.getByText('Delaware')).toBeTruthy()
    expect(screen.getByText('New Castle, DE')).toBeTruthy()
  })

  it('renders party details in table cells', () => {
    const { container } = render(<NdaDocument data={base} />)
    const cells = Array.from(container.querySelectorAll('td')).map((c) => c.textContent)
    expect(cells).toContain('Alice Smith')
    expect(cells).toContain('CEO')
    expect(cells).toContain('Acme Inc')
    expect(cells).toContain('alice@acme.com')
    expect(cells).toContain('Bob Jones')
    expect(cells).toContain('CTO')
    expect(cells).toContain('Globex LLC')
    expect(cells).toContain('bob@globex.com')
  })

  it('checks expires mndaTerm and unchecks perpetual', () => {
    render(<NdaDocument data={base} />)
    expect(checkFor(/Expires 2 year\(s\) from Effective Date/)).toBe('[x]')
    expect(checkFor(/Continues until terminated/)).toBe('[ ]')
  })

  it('checks perpetual mndaTerm and unchecks expires', () => {
    render(<NdaDocument data={{ ...base, mndaTerm: { type: 'perpetual' } }} />)
    expect(checkFor(/Continues until terminated/)).toBe('[x]')
    expect(checkFor(/Expires ___ year\(s\) from Effective Date/)).toBe('[ ]')
  })

  it('checks perpetual confidentialityTerm and unchecks expires', () => {
    render(<NdaDocument data={base} />)
    expect(checkFor('In perpetuity.')).toBe('[x]')
    expect(checkFor(/___ year\(s\) from Effective Date, but/)).toBe('[ ]')
  })

  it('checks expires confidentialityTerm and unchecks perpetual', () => {
    render(<NdaDocument data={{ ...base, confidentialityTerm: { type: 'expires', years: 3 } }} />)
    expect(checkFor(/3 year\(s\) from Effective Date, but/)).toBe('[x]')
    expect(checkFor('In perpetuity.')).toBe('[ ]')
  })

  it('renders fallback placeholder for empty fields', () => {
    render(<NdaDocument data={{ ...base, purpose: '', effectiveDate: '', governingLaw: '' }} />)
    expect(screen.getAllByText('___________').length).toBeGreaterThanOrEqual(3)
  })

  it('renders a print button that calls window.print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<NdaDocument data={base} />)
    fireEvent.click(screen.getByRole('button', { name: 'Print' }))
    expect(printSpy).toHaveBeenCalledOnce()
    printSpy.mockRestore()
  })
})
