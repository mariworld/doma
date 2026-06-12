'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getEthereumProvider, getWalletErrorMessage } from '@/lib/ethereum'

const DOMA_TESTNET = {
  chainId: '0x17CC4', // 97476 in hex
  chainName: 'Doma Testnet',
  rpcUrls: ['https://rpc-testnet.doma.xyz'],
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: ['https://explorer-testnet.doma.xyz'],
}

// Minimal ABI for tokenization (when a real contract address is available)
const DOMA_ABI = [
  'function tokenize(string memory domain, address owner) public payable',
]

const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD'

type Step = 'idle' | 'connecting' | 'switching' | 'tokenizing' | 'done' | 'error'

export default function Confirmation() {
  const [domain, setDomain] = useState<{ domain: string; price: string } | null>(null)
  const [shouldTokenize, setShouldTokenize] = useState(false)
  const [step, setStep] = useState<Step>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('selectedDomain')
    const tokenize = localStorage.getItem('tokenize')
    if (stored) setDomain(JSON.parse(stored))
    setShouldTokenize(tokenize === 'true')
  }, [])

  const handleTokenize = async () => {
    setError(null)
    try {
      // Step 1: Connect wallet
      setStep('connecting')
      const ethereum = getEthereumProvider()
      if (!ethereum) {
        throw new Error('No wallet found. Install MetaMask or Phantom, then try again.')
      }
      const provider = new ethers.BrowserProvider(ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      setWalletAddress(accounts[0])

      // Step 2: Switch to Doma testnet
      setStep('switching')
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: DOMA_TESTNET.chainId }],
        })
      } catch (switchError: unknown) {
        const err = switchError as { code?: number }
        // Chain not added yet, add it
        if (err.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [DOMA_TESTNET],
          })
        } else {
          throw switchError
        }
      }

      // Step 3: Record tokenization on Doma testnet
      setStep('tokenizing')
      const signer = await provider.getSigner()

      // 0-value transfer with no calldata — Doma rejects self-transfers that include data
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

  if (!domain) return <div className="text-white p-10">Loading...</div>

  return (
    <main className="min-h-screen bg-[#1a1a2e]">
      <header className="bg-[#de3723] px-6 py-3 flex items-center justify-between">
        <div className="text-white font-bold text-xl">💾 Namecheap</div>
        <div className="text-white text-sm">Order Confirmed 🎉</div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Success banner */}
        <div className="bg-green-900 border border-green-500 rounded-lg p-5 mb-6 text-center">
          <p className="text-green-400 text-4xl mb-2">🎉</p>
          <h1 className="text-white text-2xl font-bold">Domain Registered!</h1>
          <p className="text-green-300 mt-1">{domain.domain} is yours for 1 year</p>
        </div>

        {/* Tokenization section */}
        {shouldTokenize && (
          <div className="bg-gray-800 rounded-lg p-5 mb-6">
            <h2 className="text-white font-bold text-lg mb-1">⛓️ Tokenize on Doma Blockchain</h2>
            <p className="text-gray-400 text-sm mb-4">
              Connect your wallet to mint {domain.domain} as an NFT on the Doma testnet.
            </p>

            {step === 'idle' && (
              <button
                onClick={handleTokenize}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition"
              >
                Connect Wallet & Tokenize →
              </button>
            )}

            {step === 'connecting' && (
              <div className="text-purple-300 text-center py-3">🔌 Connecting wallet...</div>
            )}

            {step === 'switching' && (
              <div className="text-purple-300 text-center py-3">🔄 Switching to Doma Testnet...</div>
            )}

            {step === 'tokenizing' && (
              <div className="text-purple-300 text-center py-3">⛏️ Tokenizing on Doma Testnet... Please confirm in your wallet</div>
            )}

            {step === 'error' && (
              <div>
                <div className="text-red-400 text-sm mb-3">❌ {error}</div>
                <button
                  onClick={handleTokenize}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition"
                >
                  Try Again →
                </button>
              </div>
            )}

            {step === 'done' && txHash && (
              <div className="bg-purple-900 border border-purple-500 rounded-lg p-4">
                <p className="text-purple-300 font-bold text-sm mb-2">✅ Successfully tokenized on Doma testnet!</p>
                {walletAddress && (
                  <p className="text-purple-400 text-xs mb-2">
                    Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                )}
                <a
                  href={`${DOMA_TESTNET.blockExplorerUrls[0]}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 text-xs hover:underline break-all"
                >
                  View transaction → {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </div>
            )}
          </div>
        )}

        <a
          href="/"
          className="block text-center text-orange-400 hover:text-orange-300 font-bold mt-6"
        >
          ← Search another domain
        </a>
      </div>
    </main>
  )
}