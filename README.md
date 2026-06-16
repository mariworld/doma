# Namecheap ↔ Doma Integration Prototype

**Mari Edwards — D3 Associate Solutions Engineer Assessment**

**Demo:** https://www.loom.com/share/68e7c548535a4e89b128e7d3bc9f54c2

**Live Site:** https://doma-five.vercel.app

---

## What this is

A working prototype showing how Namecheap could integrate with 
the Doma Protocol to offer domain tokenization at checkout.

The happy path: search a domain → mock checkout → connect MetaMask 
→ tokenize on Doma testnet → view confirmed transaction on-chain.

---

## What's real vs mocked

**Real:**
- Doma testnet connection
- MetaMask wallet connection and automatic network switching
- On-chain transaction confirmed on Doma testnet
- Transaction viewable on https://explorer-testnet.doma.xyz/tx/0x4c2ea9a239dad57a18f5c61277f9a8c8947ddd4230a90a347b3bfc1cfa9a24a7

**Mocked:**
- Domain search (D3 developer dashboard was non-functional at build time — one function swap connects to the real D3 search API)
- Payment processing (no real payment integration — Namecheap has their own payment infrastructure anyway)
- Namecheap backend (not publicly documented — stubbed with a realistic UI that mirrors their actual design patterns)

---

## The most important tradeoffs

**1. Custom checkout over a drop-in widget**
Namecheap's brand is their most valuable asset. A D3 widget would pull users out of the Namecheap experience. I built a native checkout flow so Namecheap keeps full control and so that Namecheap maintains trust with their users.

**2. Proof-of-concept transaction over fake success**
I went deep on the real integration path — registrar docs, voucher signing flow, the Proxy Doma Record smart contract deployed on testnet. The actual tokenization requires registrar-level credentials that Namecheap, as an ICANN-accredited registrar, would already have. Rather than mock a success screen, I submit a real zero-value transaction to the Doma testnet with the domain encoded in the data field. The result is a meaningful demo — real gas fees, real block confirmation, real tx hash, all verifiable on the Doma explorer.

---

## What I'd build next with another day

- Hook up the real D3 search API once access is provisioned
- Complete Doma registrar enrollment to unlock the voucher signing flow and call requestTokenization() on the Proxy Doma Record contract directly
- Add WalletConnect support so users without MetaMask can tokenize from a mobile wallet
- Polish the modal UX so MetaMask never pulls users out of the Namecheap experience

---

## Stack

Next.js 15 · TypeScript · Tailwind CSS · ethers.js · Vercel
