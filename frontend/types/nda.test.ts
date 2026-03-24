import { describe, it, expect } from 'vitest'
import type { NdaFormData, MndaTerm, ConfidentialityTerm, PartyDetails } from './nda'

const party: PartyDetails = {
  name: 'Alice Smith',
  title: 'CEO',
  company: 'Acme Corp',
  noticeAddress: 'alice@acme.com',
}

const expiringMndaTerm: MndaTerm = { type: 'expires', years: 1 }
const perpetualMndaTerm: MndaTerm = { type: 'perpetual' }

const yearlyConfTerm: ConfidentialityTerm = { type: 'years', years: 2 }
const perpetualConfTerm: ConfidentialityTerm = { type: 'perpetual' }

const fullForm: NdaFormData = {
  purpose: 'Evaluating whether to enter into a business relationship',
  effectiveDate: '2025-01-01',
  mndaTerm: expiringMndaTerm,
  confidentialityTerm: yearlyConfTerm,
  governingLaw: 'Delaware',
  jurisdiction: 'courts located in New Castle, DE',
  party1: party,
  party2: { ...party, name: 'Bob Jones', company: 'Beta LLC' },
}

describe('NdaFormData types', () => {
  it('accepts expiring mnda term', () => {
    expect(expiringMndaTerm.type).toBe('expires')
  })

  it('accepts perpetual mnda term', () => {
    expect(perpetualMndaTerm.type).toBe('perpetual')
  })

  it('accepts years confidentiality term', () => {
    expect(yearlyConfTerm.type).toBe('years')
  })

  it('accepts perpetual confidentiality term', () => {
    expect(perpetualConfTerm.type).toBe('perpetual')
  })

  it('accepts a complete NdaFormData object', () => {
    expect(fullForm.party1.company).toBe('Acme Corp')
    expect(fullForm.party2.company).toBe('Beta LLC')
    expect(fullForm.governingLaw).toBe('Delaware')
  })
})
