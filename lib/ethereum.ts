export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>
  isMetaMask?: boolean
  isPhantom?: boolean
  providers?: EthereumProvider[]
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
    phantom?: {
      ethereum?: EthereumProvider
    }
  }
}

function collectProviders(): EthereumProvider[] {
  const providers: EthereumProvider[] = []
  const seen = new Set<EthereumProvider>()

  const add = (provider?: EthereumProvider | null) => {
    if (provider && !seen.has(provider)) {
      seen.add(provider)
      providers.push(provider)
    }
  }

  const { ethereum } = window

  if (ethereum?.providers?.length) {
    for (const provider of ethereum.providers) {
      add(provider)
    }
  }

  // Phantom's direct EVM provider bypasses the multi-wallet picker that throws "Unexpected error"
  add(window.phantom?.ethereum)
  add(ethereum)

  return providers
}

/** Prefer MetaMask; fall back to Phantom or any other injected EVM wallet. */
export function getEthereumProvider(): EthereumProvider | null {
  const providers = collectProviders()
  if (!providers.length) return null

  const metaMask = providers.find((p) => p.isMetaMask && !p.isPhantom)
  if (metaMask) return metaMask

  if (window.phantom?.ethereum) return window.phantom.ethereum

  const nonAggregator = providers.find((p) => !p.providers?.length)
  if (nonAggregator) return nonAggregator

  return providers[0]
}

export function getWalletErrorMessage(err: unknown): string {
  const e = err as { code?: number; message?: string }

  if (e.code === 4001) {
    return 'Connection rejected. Please approve the request in your wallet.'
  }

  if (e.code === -32602 || e.message?.includes('cannot include data')) {
    return 'Transaction rejected by the network. Please try again.'
  }

  if (e.message?.includes('Unexpected error')) {
    return 'Could not open your wallet. Try disabling other wallet extensions or reconnecting.'
  }

  return e.message || 'Something went wrong'
}
