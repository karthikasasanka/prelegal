export interface PartyDetails {
  name: string
  title: string
  company: string
  noticeAddress: string
}

export type NdaTerm =
  | { type: 'expires'; years: number }
  | { type: 'perpetual' }

export type MndaTerm = NdaTerm
export type ConfidentialityTerm = NdaTerm

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
