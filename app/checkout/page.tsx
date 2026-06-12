'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000))
    localStorage.setItem('tokenize', String(tokenize))
    router.push('/confirmation')
  }

  if (!domain) return <div className="text-white p-10">Loading...</div>

  return (
    <main className="min-h-screen bg-[#1a1a2e]">
      {/* Header */}
      <header className="bg-[#de3723] px-6 py-3 flex items-center justify-between">
        <div className="text-white font-bold text-xl">💾 Namecheap</div>
        <div className="text-white text-sm">Secure Checkout 🔒</div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-white text-3xl font-bold mb-8">Checkout</h1>

        {/* Order summary */}
        <div className="bg-gray-800 rounded-lg p-5 mb-6">
          <h2 className="text-gray-400 text-sm uppercase mb-3">Order Summary</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-bold text-lg">{domain.domain}</p>
              <p className="text-gray-400 text-sm">1 year registration</p>
            </div>
            <p className="text-white font-bold">{domain.price}</p>
          </div>

          {/* Tokenization option */}
          <div className="mt-4 border-t border-gray-700 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tokenize}
                onChange={e => setTokenize(e.target.checked)}
                className="mt-1 w-4 h-4 accent-purple-500"
              />
              <div>
                <p className="text-purple-300 font-bold text-sm">⛓️ Tokenize on Doma blockchain</p>
                <p className="text-gray-400 text-xs mt-1">Mint this domain as an NFT on the Doma testnet. Unlocks trading, lending, and fractional ownership. Free during testnet.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Payment form */}
        <div className="bg-gray-800 rounded-lg p-5 mb-6">
          <h2 className="text-gray-400 text-sm uppercase mb-4">Payment Details</h2>
          <div className="space-y-3">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              placeholder="Card number (test: 4242 4242 4242 4242)"
              value={form.card}
              onChange={e => setForm({ ...form, card: e.target.value })}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-3">
              <input
                placeholder="MM/YY"
                value={form.expiry}
                onChange={e => setForm({ ...form, expiry: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                placeholder="CVC"
                value={form.cvc}
                onChange={e => setForm({ ...form, cvc: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-3">🔒 This is a mock checkout. No real payment is processed.</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#f47920] hover:bg-orange-500 disabled:bg-gray-600 text-white py-4 rounded-lg font-bold text-lg transition"
        >
          {loading ? 'Processing...' : `Complete Purchase →`}
        </button>
      </div>
    </main>
  )
}