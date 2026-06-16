'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { getWalletErrorMessage, type WalletInfo } from '@/lib/ethereum'
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

interface TokenizeModalProps {
  domain: string
  onClose: (success: boolean) => void
}

export default function TokenizeModal({ domain, onClose }: TokenizeModalProps) {
  const [step, setStep] = useState<Step>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTokenize = async (wallet: WalletInfo) => {
  setError(null)
  setConnectedWallet(wallet.name)
  try {
    // Step 1: Connect wallet
    setStep('connecting')
    const provider = new ethers.BrowserProvider(wallet.provider)
    const accounts = await provider.send('eth_requestAccounts', [])
    setWalletAddress(accounts[0])

    // Step 2: Switch to Doma testnet
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

    // Step 3: Submit proof-of-concept transaction on Doma testnet
    setStep('tokenizing')
    const signer = await provider.getSigner()

    const tx = await signer.sendTransaction({
      to: BURN_ADDRESS,
      value: ethers.parseEther('0'),
      data: ethers.hexlify(ethers.toUtf8Bytes(`tokenize:${domain}`)),
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-nc-text font-bold text-lg">Tokenize on Doma</h2>
            <p className="text-nc-text-muted text-sm mt-0.5">{domain}</p>
          </div>
          {(step === 'idle' || step === 'error' || step === 'done') && (
            <button
              onClick={() => onClose(step === 'done')}
              className="text-nc-text-muted hover:text-nc-text transition-colors text-xl leading-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Step: idle */}
        {step === 'idle' && (
          <div>
            <p className="text-nc-text-muted text-sm mb-4">
              Connect your wallet to mint {domain} as an NFT on the Doma testnet.
              This unlocks trading, lending, and fractional ownership.
            </p>
            <WalletPicker onSelect={handleTokenize} />
          </div>
        )}

        {/* Step: connecting */}
        {step === 'connecting' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-nc-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-nc-text font-semibold">Connecting to {connectedWallet}...</p>
            <p className="text-nc-text-muted text-sm mt-1">Check your wallet for a connection request</p>
          </div>
        )}

        {/* Step: switching network */}
        {step === 'switching' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-nc-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-nc-text font-semibold">Switching to Doma Testnet...</p>
            <p className="text-nc-text-muted text-sm mt-1">Approve the network switch in {connectedWallet}</p>
          </div>
        )}

        {/* Step: tokenizing */}
        {step === 'tokenizing' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-nc-text font-semibold">Tokenizing on Doma Testnet...</p>
            <p className="text-nc-text-muted text-sm mt-1">Confirm the transaction in {connectedWallet}</p>
            <p className="text-nc-text-muted text-xs mt-3">This may take up to 30 seconds</p>
          </div>
        )}

        {/* Step: error */}
        {step === 'error' && (
          <div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <WalletPicker onSelect={handleTokenize} />
            <button
              onClick={() => setStep('idle')}
              className="w-full mt-3 text-nc-text-muted text-sm hover:text-nc-text transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Step: done */}
        {step === 'done' && txHash && (
          <div>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-nc-text font-bold text-lg">Successfully Tokenized!</p>
              <p className="text-nc-text-muted text-sm mt-1">{domain} is now an NFT on Doma Testnet</p>
            </div>
            <div className="bg-nc-bg-subtle border border-nc-border rounded-lg p-4 mb-4">
              {walletAddress && (
                <p className="text-nc-text-muted text-xs mb-1">
                  Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              )}
              <a
                href={`https://explorer-testnet.doma.xyz/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nc-orange text-xs hover:underline break-all"
              >
                View on Doma Explorer → {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </a>
            </div>
            <button
              onClick={() => onClose(true)}
              className="w-full bg-nc-orange hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}