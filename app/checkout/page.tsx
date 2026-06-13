'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NamecheapHeader from '@/components/NamecheapHeader'

export default function Checkout() {
  const [domain, setDomain] = useState<{ domain: string; price: string } | null>(null)
  const [tokenize, setTokenize] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvc: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('selectedDomain')
    if (stored) setDomain(JSON.parse(stored))
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.card) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    localStorage.setItem('tokenize', String(tokenize))
    router.push('/confirmation')
  }

  if (!domain) return (
    <main className="min-h-screen bg-white">
      <NamecheapHeader breadcrumb="Domains › Checkout" />
      <div className="text-nc-text-muted p-10 text-center">Loading...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-nc-bg-subtle">
      <NamecheapHeader breadcrumb="Domains › Checkout" badge="Secure Checkout" />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-nc-text text-3xl font-bold mb-8">Checkout</h1>

        {/* Order summary */}
        <div className="bg-white border border-nc-border rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-nc-text-muted text-xs uppercase tracking-wide font-semibold mb-3">Order Summary</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-nc-text font-bold text-lg">{domain.domain}</p>
              <p className="text-nc-text-muted text-sm">1 year registration</p>
            </div>
            <p className="text-nc-text font-bold text-lg">{domain.price}</p>
          </div>

          <div className="mt-4 border-t border-nc-border pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tokenize}
                onChange={e => setTokenize(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#de4b26]"
              />
              <div>
                <p className="text-nc-text font-semibold text-sm">Tokenize on Doma blockchain</p>
                <p className="text-nc-text-muted text-xs mt-1">
                  Mint this domain as an NFT on the Doma testnet. Unlocks trading, lending, and fractional ownership. Free during testnet.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Payment form */}
        <div className="bg-white border border-nc-border rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-nc-text-muted text-xs uppercase tracking-wide font-semibold mb-4">Payment Details</h2>
          <div className="space-y-3">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white text-nc-text border border-nc-border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-nc-orange/30 focus:border-nc-orange placeholder:text-nc-text-muted"
            />
            <input
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white text-nc-text border border-nc-border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-nc-orange/30 focus:border-nc-orange placeholder:text-nc-text-muted"
            />
            <input
              placeholder="Card number (test: 4242 4242 4242 4242)"
              value={form.card}
              onChange={e => setForm({ ...form, card: e.target.value })}
              className="w-full bg-white text-nc-text border border-nc-border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-nc-orange/30 focus:border-nc-orange placeholder:text-nc-text-muted"
            />
            <div className="flex gap-3">
              <input
                placeholder="MM/YY"
                value={form.expiry}
                onChange={e => setForm({ ...form, expiry: e.target.value })}
                className="w-full bg-white text-nc-text border border-nc-border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-nc-orange/30 focus:border-nc-orange placeholder:text-nc-text-muted"
              />
              <input
                placeholder="CVC"
                value={form.cvc}
                onChange={e => setForm({ ...form, cvc: e.target.value })}
                className="w-full bg-white text-nc-text border border-nc-border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-nc-orange/30 focus:border-nc-orange placeholder:text-nc-text-muted"
              />
            </div>
          </div>
          <p className="text-nc-text-muted text-xs mt-3">
            This is a mock checkout. No real payment is processed.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-nc-orange hover:bg-nc-orange-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-md font-bold text-lg transition-colors"
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>
      </div>
    </main>
  )
}
