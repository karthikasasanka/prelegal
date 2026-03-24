import { describe, it, expectTypeOf } from 'vitest'
import type { NdaFormData, NdaTerm, PartyDetails } from './nda'

describe('NdaTerm', () => {
  it('accepts expires variant with years', () => {
    expectTypeOf({ type: 'expires' as const, years: 1 }).toMatchTypeOf<NdaTerm>()
  })

  it('accepts perpetual variant', () => {
    expectTypeOf({ type: 'perpetual' as const }).toMatchTypeOf<NdaTerm>()
  })

  it('rejects unknown type', () => {
    expectTypeOf({ type: 'unknown' as const }).not.toMatchTypeOf<NdaTerm>()
  })
})

describe('PartyDetails', () => {
  it('accepts all required fields', () => {
    expectTypeOf({
      name: 'Alice',
      title: 'CEO',
      company: 'Acme',
      noticeAddress: 'alice@acme.com',
    }).toMatchTypeOf<PartyDetails>()
  })
})

describe('NdaFormData', () => {
  it('accepts a complete form object', () => {
    const party: PartyDetails = { name: 'Alice', title: 'CEO', company: 'Acme', noticeAddress: 'alice@acme.com' }
    expectTypeOf({
      purpose: 'Evaluating a business relationship',
      effectiveDate: '2025-01-01',
      mndaTerm: { type: 'expires' as const, years: 1 },
      confidentialityTerm: { type: 'perpetual' as const },
      governingLaw: 'Delaware',
      jurisdiction: 'courts located in New Castle, DE',
      party1: party,
      party2: { ...party, name: 'Bob', company: 'Beta LLC' },
    }).toMatchTypeOf<NdaFormData>()
  })
})
