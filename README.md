# Namecheap ↔ Doma Integration Prototype

**Mari Edwards — D3 Associate Solutions Engineer Assessment**

**Demo:** https://www.loom.com/share/68e7c548535a4e89b128e7d3bc9f54c2

**Live Site:** https://doma-five.vercel.app

---

## What this is

A working prototype demonstrating how Namecheap could integrate 
with the Doma Protocol to offer domain tokenization at checkout.

The happy path: search a domain → checkout → connect MetaMask 
→ tokenize on Doma testnet → view confirmed transaction on-chain.

---

## What's real vs mocked

**Real:**
- Doma testnet connection (Chain ID: 97476)
- MetaMask wallet connection and automatic network switching
- On-chain transaction confirmed on Doma testnet
- Transaction verifiable on the Doma explorer

**Mocked:**
- Domain search — one function swap connects to the real D3 search API
- Payment processing — Namecheap has their own payment infrastructure
- Namecheap backend — not publicly documented, stubbed with a 
  realistic UI that mirrors their actual design patterns

---

## Key tradeoffs

**Custom checkout over a drop-in widget**
Namecheap's brand is their most valuable asset. A D3 widget 
pulls users out of their experience. A native checkout flow 
keeps Namecheap in full control — their colors, their copy, 
their customer relationship.

**Proof-of-concept transaction over fake success**
I went deep on the real integration path — registrar docs, 
voucher signing flow, the Proxy Doma Record smart contract 
deployed on testnet. The actual tokenization requires 
registrar-level credentials that Namecheap, as an 
ICANN-accredited registrar, would already have. Rather than 
mock a success screen, I submit a real zero-value transaction 
to the Doma testnet with the domain encoded in the data field. 
Real gas fees, real block confirmation, real tx hash — all 
verifiable on the Doma explorer.

---

## What's next with another day

- Hook up the real D3 search API once access is provisioned
- Complete Doma registrar enrollment to unlock the voucher 
  signing flow and call requestTokenization() on the Proxy 
  Doma Record contract directly
- Add WalletConnect so users without MetaMask can tokenize 
  from a mobile wallet
- Polish the modal UX so MetaMask never pulls users out of 
  the Namecheap experience

---

## Stack

Next.js 15 · TypeScript · Tailwind CSS · ethers.js · Vercel
