import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 31337)
const RPC_URL  = import.meta.env.VITE_RPC_URL || 'http://127.0.0.1:8545'

export const hardhat = defineChain({
  id: CHAIN_ID,
  name: 'Hardhat',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } }
})

export const config = createConfig({
  chains: [hardhat],
  connectors: [injected({ shimDisconnect: true })],
  transports: { [hardhat.id]: http(RPC_URL) },
  multiInjectedProviderDiscovery: false
})
