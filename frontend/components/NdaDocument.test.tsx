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

function checkedSpans(container: HTMLElement): number {
  return Array.from(container.querySelectorAll('span')).filter((s) => s.textContent === '[x]').length
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
    expect(cells).toContain('Acme Inc')
    expect(cells).toContain('Bob Jones')
    expect(cells).toContain('Globex LLC')
  })

  it('checks expires mndaTerm and perpetual confidentialityTerm', () => {
    const { container } = render(<NdaDocument data={base} />)
    expect(checkedSpans(container)).toBe(2)
  })

  it('checks both perpetual when mndaTerm is perpetual', () => {
    const { container } = render(<NdaDocument data={{ ...base, mndaTerm: { type: 'perpetual' } }} />)
    expect(checkedSpans(container)).toBe(2)
  })

  it('shows year count in expires mndaTerm label', () => {
    render(<NdaDocument data={base} />)
    expect(screen.getByText(/Expires 2 year\(s\) from Effective Date/)).toBeTruthy()
  })

  it('renders a print button that calls window.print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<NdaDocument data={base} />)
    fireEvent.click(screen.getByRole('button', { name: 'Print' }))
    expect(printSpy).toHaveBeenCalledOnce()
    printSpy.mockRestore()
  })
})
