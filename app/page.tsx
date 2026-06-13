'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NamecheapHeader from '@/components/NamecheapHeader'

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
    <main className="min-h-screen bg-white">
      <NamecheapHeader breadcrumb="Domains › Domain Name Search" />

      {/* Promo banner */}
      <div className="bg-nc-blue-gray text-white text-center text-sm py-2.5 px-4">
        Transfer all your domains to Namecheap. No hidden extras, no renewal scares{' '}
        <a href="#" className="underline hover:no-underline">→</a>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6 text-center">
        {/* Illustration placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-40 bg-gradient-to-br from-blue-100 via-purple-50 to-orange-50 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-8 w-2 h-2 bg-yellow-300 rounded-full" />
              <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-blue-300 rounded-full" />
              <div className="absolute bottom-6 left-16 w-1 h-1 bg-purple-300 rounded-full" />
              <div className="absolute bottom-10 right-8 w-2 h-2 bg-orange-200 rounded-full" />
            </div>
            <div className="text-center z-10">
              <p className="text-nc-blue-gray text-xs font-semibold tracking-widest uppercase">Make more online</p>
              <p className="text-nc-orange text-xs font-bold tracking-widest uppercase">for less</p>
            </div>
          </div>
        </div>

        <h1 className="text-nc-text text-3xl md:text-4xl font-bold mb-8">
          Search for a domain name
        </h1>

        {/* Search bar */}
        <div className="flex max-w-2xl mx-auto shadow-sm">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Find your new domain name, for less"
              className="w-full px-4 py-3.5 text-nc-text text-base bg-white border border-nc-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-nc-orange/30 focus:border-nc-orange placeholder:text-nc-text-muted"
            />
            <a
              href="#"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-nc-orange text-sm font-medium hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Beast Mode
            </a>
          </div>
          <button
            onClick={handleSearch}
            className="bg-nc-orange hover:bg-nc-orange-hover text-white px-8 py-3.5 font-bold text-base rounded-r-md transition-colors shrink-0"
          >
            Search
          </button>
        </div>

        <p className="mt-4 text-sm text-nc-text-muted">
          Is your domain name with a different registrar?{' '}
          <a href="#" className="text-nc-orange hover:underline">Transfer it today</a>
        </p>
      </div>

      {/* Secondary heading */}
      <div className="max-w-3xl mx-auto px-6 py-10 text-center border-t border-nc-border mt-6">
        <h2 className="text-nc-text text-2xl font-bold mb-2">Discover a huge variety of domains</h2>
        <p className="text-nc-text-muted text-sm">Check domain name availability and secure yours now.</p>
      </div>

      {/* Results */}
      {searched && result && (
        <div className="max-w-2xl mx-auto px-6 pb-16">
          <div className={`rounded-lg border p-5 flex items-center justify-between ${result.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div>
              <p className="text-nc-text text-xl font-bold">{result.domain}</p>
              <p className={`text-sm mt-1 font-medium ${result.available ? 'text-green-700' : 'text-red-600'}`}>
                {result.available ? 'Available' : 'Taken'}
              </p>
            </div>
            <div className="text-right">
              {result.available && (
                <>
                  <p className="text-nc-text font-bold text-lg">{result.price}</p>
                  <button
                    onClick={handleAddToCart}
                    className="mt-2 bg-nc-orange hover:bg-nc-orange-hover text-white px-6 py-2 rounded font-bold text-sm transition-colors"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </div>

          {result.available && (
            <div className="mt-4 bg-nc-bg-subtle border border-nc-border rounded-lg p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-nc-blue-gray rounded flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <p className="text-nc-text font-semibold text-sm">Doma Blockchain Tokenization Available</p>
                <p className="text-nc-text-muted text-xs mt-1">
                  This domain can be tokenized as an NFT on the Doma testnet — unlocking trading, lending, and fractional ownership.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
