'use client'

import { useState } from 'react'
import { NdaFormData, PartyDetails, NdaTerm } from '../types/nda'

const inputClass =
  'w-full border-b border-stone-300 bg-transparent py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-700 focus:outline-none'

function PartySection({
  label,
  value,
  onChange,
}: {
  label: string
  value: PartyDetails
  onChange: (v: PartyDetails) => void
}) {
  const input = (key: keyof PartyDetails, placeholder: string) => (
    <input
      value={value[key]}
      onChange={(e) => onChange({ ...value, [key]: e.target.value })}
      placeholder={placeholder}
      className={inputClass}
    />
  )
  return (
    <fieldset className="space-y-4">
      <legend className="text-xs font-semibold uppercase tracking-widest text-stone-500">{label}</legend>
      <div className="grid grid-cols-2 gap-4">
        {input('name', 'Full name')}
        {input('title', 'Title')}
      </div>
      {input('company', 'Company')}
      <textarea
        value={value.noticeAddress}
        onChange={(e) => onChange({ ...value, noticeAddress: e.target.value })}
        placeholder="Notice address"
        rows={2}
        className={`${inputClass} resize-none`}
      />
    </fieldset>
  )
}

function TermField({
  label,
  value,
  onChange,
}: {
  label: string
  value: NdaTerm
  onChange: (v: NdaTerm) => void
}) {
  const expiresYears = value.type === 'expires' ? value.years : 2
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">{label}</p>
      <div className="flex gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
          <input
            type="radio"
            checked={value.type === 'perpetual'}
            onChange={() => onChange({ type: 'perpetual' })}
            className="accent-stone-700"
          />
          Perpetual
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
          <input
            type="radio"
            checked={value.type === 'expires'}
            onChange={() => onChange({ type: 'expires', years: expiresYears })}
            className="accent-stone-700"
          />
          Expires after
          <input
            type="number"
            min={1}
            max={99}
            disabled={value.type !== 'expires'}
            value={expiresYears}
            onChange={(e) => onChange({ type: 'expires', years: Number(e.target.value) })}
            className="w-12 border-b border-stone-300 bg-transparent text-center text-sm focus:border-stone-700 focus:outline-none disabled:opacity-30"
          />
          years
        </label>
      </div>
    </div>
  )
}

const emptyParty = (): PartyDetails => ({ name: '', title: '', company: '', noticeAddress: '' })

const initFormData = (): NdaFormData => ({
  purpose: '',
  effectiveDate: '',
  mndaTerm: { type: 'perpetual' },
  confidentialityTerm: { type: 'perpetual' },
  governingLaw: '',
  jurisdiction: '',
  party1: emptyParty(),
  party2: emptyParty(),
})

export function NdaForm({ onSubmit }: { onSubmit: (data: NdaFormData) => void }) {
  const [form, setForm] = useState<NdaFormData>(initFormData)
  const set = <K extends keyof NdaFormData>(key: K, value: NdaFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
      className="mx-auto max-w-2xl space-y-10 bg-stone-50 px-8 py-10 font-serif"
    >
      <header className="border-b border-stone-300 pb-6">
        <p className="text-xs uppercase tracking-widest text-stone-400">Common Paper</p>
        <h1 className="mt-1 text-2xl font-semibold text-stone-900">Mutual NDA</h1>
      </header>

      <section className="space-y-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500">Agreement Terms</h2>
        <div>
          <label className="text-xs text-stone-400">Purpose</label>
          <input
            className={inputClass}
            value={form.purpose}
            onChange={(e) => set('purpose', e.target.value)}
            placeholder="Purpose of disclosure"
          />
        </div>
        <div>
          <label className="text-xs text-stone-400">Effective Date</label>
          <input
            className={inputClass}
            type="date"
            value={form.effectiveDate}
            onChange={(e) => set('effectiveDate', e.target.value)}
          />
        </div>
        <TermField label="MNDA Term" value={form.mndaTerm} onChange={(v) => set('mndaTerm', v)} />
        <TermField
          label="Confidentiality Term"
          value={form.confidentialityTerm}
          onChange={(v) => set('confidentialityTerm', v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-400">Governing Law</label>
            <input
              className={inputClass}
              value={form.governingLaw}
              onChange={(e) => set('governingLaw', e.target.value)}
              placeholder="e.g. Delaware"
            />
          </div>
          <div>
            <label className="text-xs text-stone-400">Jurisdiction</label>
            <input
              className={inputClass}
              value={form.jurisdiction}
              onChange={(e) => set('jurisdiction', e.target.value)}
              placeholder="e.g. Delaware courts"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-500">Parties</h2>
        <PartySection label="Party 1" value={form.party1} onChange={(v) => set('party1', v)} />
        <div className="border-t border-stone-200 pt-6">
          <PartySection label="Party 2" value={form.party2} onChange={(v) => set('party2', v)} />
        </div>
      </section>

      <button
        type="submit"
        className="w-full border border-stone-800 bg-stone-900 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-stone-700"
      >
        Generate Agreement
      </button>
    </form>
  )
}
