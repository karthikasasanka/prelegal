export interface PartyDetails {
  name: string
  title: string
  company: string
  noticeAddress: string
}

export type MndaTerm =
  | { type: 'expires'; years: number }
  | { type: 'perpetual' }

export type ConfidentialityTerm =
  | { type: 'years'; years: number }
  | { type: 'perpetual' }

export interface NdaFormData {
  purpose: string
  effectiveDate: string
  mndaTerm: MndaTerm
  confidentialityTerm: ConfidentialityTerm
  governingLaw: string
  jurisdiction: string
  party1: PartyDetails
  party2: PartyDetails
}
