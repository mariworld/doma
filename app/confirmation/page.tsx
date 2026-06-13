'use client'

import { useState, useEffect } from 'react'
import NamecheapHeader from '@/components/NamecheapHeader'
import TokenizeModal from '@/components/TokenizeModal'

export default function Confirmation() {
  const [domain, setDomain] = useState<{ domain: string; price: string } | null>(null)
  const [shouldTokenize, setShouldTokenize] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [tokenized, setTokenized] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('selectedDomain')
    const tokenize = localStorage.getItem('tokenize')
    if (stored) setDomain(JSON.parse(stored))
    setShouldTokenize(tokenize === 'true')
  }, [])

  if (!domain) return (
    <main className="min-h-screen bg-white">
      <NamecheapHeader breadcrumb="Domains › Confirmation" />
      <div className="text-nc-text-muted p-10 text-center">Loading...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-nc-bg-subtle">
      <NamecheapHeader breadcrumb="Domains › Confirmation" badge="Order Confirmed" />

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Success banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-nc-text text-2xl font-bold">Domain Registered!</h1>
          <p className="text-green-700 mt-1">{domain.domain} is yours for 1 year</p>
        </div>

        {/* Tokenization CTA */}
        {shouldTokenize && (
          <div className="bg-white border border-nc-border rounded-lg p-5 mb-6 shadow-sm">
            <h2 className="text-nc-text font-bold text-lg mb-1">⛓️ Tokenize on Doma Blockchain</h2>
            <p className="text-nc-text-muted text-sm mb-4">
              Mint {domain.domain} as an NFT on the Doma testnet — unlocking trading, lending, and fractional ownership.
            </p>

            {tokenized ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm font-semibold">✅ Domain successfully tokenized on Doma Testnet</p>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-nc-orange hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition"
              >
                Tokenize this domain →
              </button>
            )}
          </div>
        )}

        <a
          href="/"
          className="block text-center text-nc-orange hover:underline font-semibold mt-6"
        >
          ← Search another domain
        </a>
      </div>

      {/* Modal */}
      {showModal && (
        <TokenizeModal
          domain={domain.domain}
          onClose={() => {
            setShowModal(false)
            setTokenized(true)
          }}
        />
      )}
    </main>
  )
}