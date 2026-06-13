export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>
  isMetaMask?: boolean
  isPhantom?: boolean
  isCoinbaseWallet?: boolean
  isRabby?: boolean
  isBraveWallet?: boolean
  providers?: EthereumProvider[]
}

export type WalletInfo = {
  id: string
  name: string
  icon?: string
  provider: EthereumProvider
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

function isPhantomWallet(
  provider: EthereumProvider,
  name?: string,
  rdns?: string,
): boolean {
  return !!(
    provider.isPhantom ||
    rdns?.includes('phantom') ||
    name?.toLowerCase().includes('phantom')
  )
}

type Eip6963ProviderDetail = {
  info: { uuid: string; name: string; icon: string; rdns: string }
  provider: EthereumProvider
}

/** Discover installed EVM wallets via EIP-6963, with legacy fallbacks. */
export function discoverWallets(timeoutMs = 300): Promise<WalletInfo[]> {
  return new Promise((resolve) => {
    const wallets: WalletInfo[] = []
    const seenProviders = new Set<EthereumProvider>()
    const seenKeys = new Set<string>()

    const add = (wallet: WalletInfo, key?: string) => {
      if (isPhantomWallet(wallet.provider, wallet.name, key)) return
      if (seenProviders.has(wallet.provider)) return

      const walletKey = normalizeWalletKey(key ?? inferWalletKey(wallet.provider, wallet.name))
      if (seenKeys.has(walletKey)) return

      seenProviders.add(wallet.provider)
      seenKeys.add(walletKey)
      wallets.push(wallet)
    }

    const onAnnounce = (event: Event) => {
      const { info, provider } = (event as CustomEvent<Eip6963ProviderDetail>).detail
      if (isPhantomWallet(provider, info.name, info.rdns)) return
      add({ id: info.uuid, name: info.name, icon: info.icon, provider }, info.rdns)
    }

    window.addEventListener('eip6963:announceProvider', onAnnounce)
    window.dispatchEvent(new Event('eip6963:requestProvider'))

    setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', onAnnounce)
      addLegacyWallets(add)
      resolve(wallets)
    }, timeoutMs)
  })
}

function normalizeWalletKey(key: string): string {
  const lower = key.toLowerCase()
  if (lower.includes('metamask')) return 'metamask'
  if (lower.includes('coinbase')) return 'coinbase'
  if (lower.includes('rabby')) return 'rabby'
  if (lower.includes('brave')) return 'brave'
  return lower
}

function inferWalletKey(provider: EthereumProvider, name?: string): string {
  if (provider.isCoinbaseWallet) return 'coinbase'
  if (provider.isRabby) return 'rabby'
  if (provider.isBraveWallet) return 'brave'
  if (provider.isMetaMask) return 'metamask'
  if (name) return name.toLowerCase().replace(/\s+/g, '-')
  return 'browser-wallet'
}

function addLegacyWallets(add: (wallet: WalletInfo) => void) {
  const { ethereum } = window
  if (!ethereum) return

  if (ethereum.providers?.length) {
    for (const provider of ethereum.providers) {
      if (isPhantomWallet(provider)) continue
      add(providerToWallet(provider))
    }
    return
  }

  if (isPhantomWallet(ethereum)) return

  add(providerToWallet(ethereum))
}

function providerToWallet(provider: EthereumProvider): WalletInfo {
  if (provider.isCoinbaseWallet) {
    return { id: 'coinbase-injected', name: 'Coinbase Wallet', provider }
  }
  if (provider.isRabby) {
    return { id: 'rabby-injected', name: 'Rabby', provider }
  }
  if (provider.isBraveWallet) {
    return { id: 'brave-injected', name: 'Brave Wallet', provider }
  }
  if (provider.isMetaMask) {
    return { id: 'metamask-injected', name: 'MetaMask', provider }
  }
  return { id: 'injected-unknown', name: 'Browser Wallet', provider }
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
