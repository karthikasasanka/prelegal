'use client'

import { useState } from 'react'
import { NdaForm } from '../components/NdaForm'
import { NdaDocument } from '../components/NdaDocument'
import { NdaFormData } from '../types/nda'

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData | null>(null)

  if (formData) {
    return (
      <div className="min-h-screen bg-stone-100 py-10">
        <div className="mx-auto max-w-2xl px-4 pb-4 print:hidden">
          <button
            onClick={() => setFormData(null)}
            className="text-sm text-stone-500 underline underline-offset-2 hover:text-stone-800"
          >
            &larr; Edit
          </button>
        </div>
        <NdaDocument data={formData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 py-10">
      <NdaForm onSubmit={setFormData} />
    </div>
  )
}
