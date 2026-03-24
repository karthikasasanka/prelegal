'use client'

import type { ReactNode } from 'react'
import { NdaFormData } from '../types/nda'

function termYears(years: number): string {
  return `${years} year(s)`
}

function CheckItem({ checked, children }: { checked: boolean; children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 shrink-0 text-stone-700">{checked ? '[x]' : '[ ]'}</span>
      <span>{children}</span>
    </p>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, p1, p2 }: { label: string; p1: string; p2: string }) {
  return (
    <tr className="border-t border-stone-300">
      <td className="py-2 pr-4 text-xs font-semibold text-stone-500">{label}</td>
      <td className="py-2 pr-4 text-sm text-stone-800">{p1}</td>
      <td className="py-2 text-sm text-stone-800">{p2}</td>
    </tr>
  )
}

export function NdaDocument({ data }: { data: NdaFormData }) {
  const { purpose, effectiveDate, mndaTerm, confidentialityTerm, governingLaw, jurisdiction, party1, party2 } = data

  return (
    <article className="mx-auto max-w-2xl space-y-8 bg-stone-50 px-8 py-10 font-serif text-stone-800">
        <header className="border-b border-stone-300 pb-6">
          <p className="text-xs uppercase tracking-widest text-stone-400">Common Paper</p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900">Mutual Non-Disclosure Agreement</h1>
          <p className="mt-3 text-sm text-stone-600">
            This MNDA consists of this Cover Page and the{' '}
            <span className="font-medium">Common Paper Mutual NDA Standard Terms Version 1.0</span>.
          </p>
        </header>

        <section className="space-y-5">
          <Field label="Purpose">
            <p className="text-sm">{purpose || '___________'}</p>
          </Field>

          <Field label="Effective Date">
            <p className="text-sm">{effectiveDate || '___________'}</p>
          </Field>

          <Field label="MNDA Term">
            <CheckItem checked={mndaTerm.type === 'expires'}>
              Expires {mndaTerm.type === 'expires' ? termYears(mndaTerm.years) : '___ year(s)'} from Effective Date.
            </CheckItem>
            <CheckItem checked={mndaTerm.type === 'perpetual'}>
              Continues until terminated in accordance with the terms of the MNDA.
            </CheckItem>
          </Field>

          <Field label="Term of Confidentiality">
            <CheckItem checked={confidentialityTerm.type === 'expires'}>
              {confidentialityTerm.type === 'expires' ? termYears(confidentialityTerm.years) : '___ year(s)'} from Effective Date, but in the case of trade secrets until no longer a
              trade secret under applicable laws.
            </CheckItem>
            <CheckItem checked={confidentialityTerm.type === 'perpetual'}>In perpetuity.</CheckItem>
          </Field>

          <Field label="Governing Law & Jurisdiction">
            <p className="text-sm">
              Governing Law: <span className="font-medium">{governingLaw || '___________'}</span>
            </p>
            <p className="text-sm">
              Jurisdiction: <span className="font-medium">{jurisdiction || '___________'}</span>
            </p>
          </Field>
        </section>

        <section>
          <p className="mb-4 text-sm text-stone-600">
            By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
          </p>
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className="w-1/3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-stone-400" />
                <th className="py-2 text-left text-xs font-semibold uppercase tracking-widest text-stone-500">
                  Party 1
                </th>
                <th className="py-2 text-left text-xs font-semibold uppercase tracking-widest text-stone-500">
                  Party 2
                </th>
              </tr>
            </thead>
            <tbody>
              <Row label="Print Name" p1={party1.name} p2={party2.name} />
              <Row label="Title" p1={party1.title} p2={party2.title} />
              <Row label="Company" p1={party1.company} p2={party2.company} />
              <Row label="Notice Address" p1={party1.noticeAddress} p2={party2.noticeAddress} />
              <Row label="Signature" p1="" p2="" />
              <Row label="Date" p1="" p2="" />
            </tbody>
          </table>
        </section>

        <footer className="border-t border-stone-200 pt-4 text-xs text-stone-400">
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under CC BY 4.0.
        </footer>

        <div className="flex justify-end print:hidden">
          <button
            onClick={() => window.print()}
            className="border border-stone-800 bg-stone-900 px-6 py-2 text-sm font-medium tracking-wide text-white transition-colors hover:bg-stone-700"
          >
            Print
          </button>
        </div>
    </article>
  )
}
