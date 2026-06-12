'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MOCK_DOMAINS: Record<string, { available: boolean; price: string }> = {
  'testmari.io': { available: false, price: '$39.00/yr' },
  'testmari.com': { available: true, price: '$12.98/yr' },
  'testmari.xyz': { available: true, price: '$2.99/yr' },
  'testmari.ai': { available: true, price: '$79.00/yr' },
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<{ domain: string; available: boolean; price: string } | null>(null)
  const [searched, setSearched] = useState(false)
  const router = useRouter()

  const handleSearch = () => {
    if (!query) return
    const domain = query.toLowerCase().includes('.') ? query.toLowerCase() : `${query.toLowerCase()}.com`
    const data = MOCK_DOMAINS[domain] || { available: true, price: '$12.98/yr' }
    setResult({ domain, ...data })
    setSearched(true)
  }

  const handleAddToCart = () => {
    if (!result) return
    localStorage.setItem('selectedDomain', JSON.stringify(result))
    router.push('/checkout')
  }

  return (
    <main className="min-h-screen bg-[#07070f]">
      {/* Namecheap-style header */}
      <header className="bg-[#e8412e] px-6 py-3 flex items-center justify-between shadow-lg shadow-black/40">
        <div className="flex items-center gap-2">
          <div className="text-white font-bold text-xl drop-shadow-sm">💾 Namecheap</div>
          <span className="text-white/90 text-xs ml-4 font-medium">Domains • Hosting • SSL</span>
        </div>
        <div className="text-white font-semibold text-sm">Sign In | Create Account</div>
      </header>

      {/* Hero search */}
      <div className="bg-gradient-to-b from-[#e8412e] via-[#8b1a0e] to-[#07070f] px-6 py-16 text-center">
        <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-md">Find your perfect domain</h1>
        <p className="text-amber-100 mb-8 text-lg font-medium">Now with Doma blockchain tokenization</p>
        <div className="flex max-w-2xl mx-auto gap-0 shadow-2xl shadow-black/50 rounded-lg overflow-hidden ring-2 ring-white/20">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search your domain name..."
            className="flex-1 px-4 py-3 text-gray-950 text-lg bg-white placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
          />
          <button
            onClick={handleSearch}
            className="bg-[#ff6b00] hover:bg-[#ff8533] text-white px-8 py-3 font-bold text-lg transition border-l-2 border-[#cc5500]"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && result && (
        <div className="max-w-2xl mx-auto mt-10 px-6">
          <div className={`rounded-xl p-5 flex items-center justify-between shadow-lg ${result.available ? 'bg-[#052e16] border-2 border-emerald-400' : 'bg-[#2a0a0a] border-2 border-red-400'}`}>
            <div>
              <p className="text-white text-xl font-bold">{result.domain}</p>
              <p className={`text-sm mt-1 font-semibold ${result.available ? 'text-emerald-300' : 'text-red-300'}`}>
                {result.available ? '✅ Available' : '❌ Taken'}
              </p>
            </div>
            <div className="text-right">
              {result.available && (
                <>
                  <p className="text-amber-300 font-bold text-lg">{result.price}</p>
                  <button
                    onClick={handleAddToCart}
                    className="mt-2 bg-[#ff6b00] hover:bg-[#ff8533] text-white px-6 py-2 rounded-lg font-bold transition shadow-md shadow-orange-900/50"
                  >
                    Add to Cart →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tokenization badge */}
          {result.available && (
            <div className="mt-4 bg-[#1a0a2e] border-2 border-violet-400 rounded-xl p-4 flex items-center gap-3 shadow-lg shadow-violet-950/50">
              <span className="text-2xl">⛓️</span>
              <div>
                <p className="text-violet-200 font-bold text-sm">Doma Blockchain Tokenization Available</p>
                <p className="text-cyan-300 text-xs mt-1">This domain can be tokenized as an NFT on the Doma testnet — unlocking trading, lending, and fractional ownership.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}