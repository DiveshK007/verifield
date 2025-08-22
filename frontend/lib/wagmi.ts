'use client';

import { createConfig, http } from 'wagmi';
import { hardhat } from 'viem/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

// Read chain & RPC from env, fall back to Hardhat local
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '31337');
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? 'http://127.0.0.1:8545';

// Build a chain object using the env values
export const chain = {
  ...hardhat,
  id: chainId,
  rpcUrls: { default: { http: [rpcUrl] } },
};

export function assertEnv() {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_CHAIN_ID) missing.push('NEXT_PUBLIC_CHAIN_ID');
  if (!process.env.NEXT_PUBLIC_RPC_URL) missing.push('NEXT_PUBLIC_RPC_URL');
  if (!process.env.NEXT_PUBLIC_APP_NAME) missing.push('NEXT_PUBLIC_APP_NAME');
  if (!process.env.NEXT_PUBLIC_STORAGE_GATEWAY) missing.push('NEXT_PUBLIC_STORAGE_GATEWAY');
  if (missing.length) throw new Error(`Missing env: ${missing.join(', ')}`);
}

// Global Wagmi config
assertEnv();

export const config = createConfig({
  chains: [chain],
  connectors: [injected()],
  transports: {
    [chain.id]: http(rpcUrl),
  },
});

export const queryClient = new QueryClient();

