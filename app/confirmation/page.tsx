'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getWalletErrorMessage, type WalletInfo } from '@/lib/ethereum'
import NamecheapHeader from '@/components/NamecheapHeader'
import WalletPicker from '@/components/WalletPicker'

const DOMA_TESTNET = {
  chainId: '0x17CC4',
  chainName: 'Doma Testnet',
  rpcUrls: ['https://rpc-testnet.doma.xyz'],
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: ['https://explorer-testnet.doma.xyz'],
}

const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD'

type Step = 'idle' | 'connecting' | 'switching' | 'tokenizing' | 'done' | 'error'

export default function Confirmation() {
  const [domain, setDomain] = useState<{ domain: string; price: string } | null>(null)
  const [shouldTokenize, setShouldTokenize] = useState(false)
  const [step, setStep] = useState<Step>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('selectedDomain')
    const tokenize = localStorage.getItem('tokenize')
    if (stored) setDomain(JSON.parse(stored))
    setShouldTokenize(tokenize === 'true')
  }, [])

  const handleTokenize = async (wallet: WalletInfo) => {
    setError(null)
    setConnectedWallet(wallet.name)
    try {
      setStep('connecting')
      const provider = new ethers.BrowserProvider(wallet.provider)
      const accounts = await provider.send('eth_requestAccounts', [])
      setWalletAddress(accounts[0])

      setStep('switching')
      try {
        await wallet.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: DOMA_TESTNET.chainId }],
        })
      } catch (switchError: unknown) {
        const err = switchError as { code?: number }
        if (err.code === 4902) {
          await wallet.provider.request({
            method: 'wallet_addEthereumChain',
            params: [DOMA_TESTNET],
          })
        } else {
          throw switchError
        }
      }

      setStep('tokenizing')
      const signer = await provider.getSigner()

      const tx = await signer.sendTransaction({
        to: BURN_ADDRESS,
        value: ethers.parseEther('0'),
      })

      await tx.wait()
      setTxHash(tx.hash)
      setStep('done')

    } catch (err: unknown) {
      console.error(err)
      setError(getWalletErrorMessage(err))
      setStep('error')
    }
  }

  const handleRetry = () => {
    setConnectedWallet(null)
    setStep('idle')
  }

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
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-nc-text text-2xl font-bold">Domain Registered!</h1>
          <p className="text-green-700 mt-1">{domain.domain} is yours for 1 year</p>
        </div>

        {shouldTokenize && (
          <div className="bg-white border border-nc-border rounded-lg p-5 mb-6 shadow-sm">
            <h2 className="text-nc-text font-bold text-lg mb-1">Tokenize on Doma Blockchain</h2>
            <p className="text-nc-text-muted text-sm mb-4">
              Connect your wallet to mint {domain.domain} as an NFT on the Doma testnet.
            </p>

            {step === 'idle' && (
              <WalletPicker onSelect={handleTokenize} />
            )}

            {step === 'connecting' && (
              <div className="text-nc-text-muted text-center py-3">
                Connecting to {connectedWallet}...
              </div>
            )}

            {step === 'switching' && (
              <div className="text-nc-text-muted text-center py-3">
                Switching {connectedWallet} to Doma Testnet...
              </div>
            )}

            {step === 'tokenizing' && (
              <div className="text-nc-text-muted text-center py-3">
                Tokenizing on Doma Testnet... Please confirm in {connectedWallet}
              </div>
            )}

            {step === 'error' && (
              <div>
                <div className="text-red-600 text-sm mb-3">{error}</div>
                <WalletPicker onSelect={handleTokenize} />
                <button
                  onClick={handleRetry}
                  className="w-full mt-3 text-nc-text-muted text-sm hover:text-nc-text transition-colors"
                >
                  Choose a different wallet
                </button>
              </div>
            )}

            {step === 'done' && txHash && (
              <div className="bg-nc-bg-subtle border border-nc-border rounded-lg p-4">
                <p className="text-nc-text font-semibold text-sm mb-2">Successfully tokenized on Doma testnet!</p>
                {connectedWallet && (
                  <p className="text-nc-text-muted text-xs mb-1">Wallet: {connectedWallet}</p>
                )}
                {walletAddress && (
                  <p className="text-nc-text-muted text-xs mb-2">
                    Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                )}
                <a
                  href={`${DOMA_TESTNET.blockExplorerUrls[0]}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nc-orange text-xs hover:underline break-all"
                >
                  View transaction → {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </div>
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
    </main>
  )
}
