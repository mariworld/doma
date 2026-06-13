'use client'

import { useEffect, useState } from 'react'
import { discoverWallets, type WalletInfo } from '@/lib/ethereum'

type WalletPickerProps = {
  onSelect: (wallet: WalletInfo) => void
  disabled?: boolean
}

const INSTALL_LINKS = [
  { name: 'MetaMask', href: 'https://metamask.io/download/' },
  { name: 'Coinbase Wallet', href: 'https://www.coinbase.com/wallet/downloads' },
]

export default function WalletPicker({ onSelect, disabled }: WalletPickerProps) {
  const [wallets, setWallets] = useState<WalletInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    discoverWallets().then((found) => {
      setWallets(found)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="text-nc-text-muted text-center py-4 text-sm">
        Detecting wallets...
      </div>
    )
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-nc-text-muted text-sm mb-3">No wallet detected. Install one to continue:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {INSTALL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-nc-orange text-sm font-medium hover:underline"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-nc-text-muted text-sm mb-3">Choose a wallet to connect:</p>
      {wallets.map((wallet) => (
        <button
          key={wallet.id}
          onClick={() => onSelect(wallet)}
          disabled={disabled}
          className="w-full flex items-center gap-3 px-4 py-3 border border-nc-border rounded-md hover:border-nc-orange hover:bg-orange-50/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {wallet.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={wallet.icon} alt="" className="w-8 h-8 rounded-md" />
          ) : (
            <div className="w-8 h-8 bg-nc-bg-subtle border border-nc-border rounded-md flex items-center justify-center text-xs font-bold text-nc-text-muted">
              {wallet.name.charAt(0)}
            </div>
          )}
          <span className="text-nc-text font-medium">{wallet.name}</span>
        </button>
      ))}
    </div>
  )
}
