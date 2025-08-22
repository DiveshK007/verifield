'use client';

import { createConfig, http } from 'wagmi';
import { hardhat } from 'viem/chains';
import { injected } from 'wagmi/connectors';

// Read chain & RPC from env, fall back to Hardhat local
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '31337');
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? 'http://127.0.0.1:8545';

// Build a chain object using the env values
export const chain = {
  ...hardhat,
  id: chainId,
  rpcUrls: { default: { http: [rpcUrl] } },
};

// Global Wagmi config
export const config = createConfig({
  chains: [chain],
  connectors: [injected()],
  transports: {
    [chain.id]: http(rpcUrl),
  },
});

