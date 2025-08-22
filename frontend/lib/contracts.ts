'use client';

import { isAddress, createPublicClient, createWalletClient, custom, http, parseAbiItem, decodeEventLog, type Address } from 'viem';
import { dataNftAbi } from './abis/DataNFT';

export type DatasetMeta = {
  cid: string;
  sha256sum: string;
  licenseUri: string;
  domain: string;
  tags: string[];
  verified: boolean;
};

export function getDataNftAddress(): Address {
  const addr = process.env.NEXT_PUBLIC_DATANFT_ADDRESS;
  if (!addr) throw new Error('NEXT_PUBLIC_DATANFT_ADDRESS is not set. Add it to frontend/.env.local');
  if (!isAddress(addr)) throw new Error(`Invalid NEXT_PUBLIC_DATANFT_ADDRESS: ${addr}`);
  return addr as Address;
}

export function getStorageGateway(): string {
  return process.env.NEXT_PUBLIC_STORAGE_GATEWAY || 'https://ipfs.io/ipfs/';
}

export function getClients() {
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || '31337');
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545';
  const publicClient = createPublicClient({ chain: { id: chainId, name: 'env', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [rpcUrl] } } } as any, transport: http(rpcUrl) });
  const walletClient = typeof window !== 'undefined' && (window as any).ethereum
    ? createWalletClient({ chain: { id: chainId, name: 'env', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [rpcUrl] } } } as any, transport: custom((window as any).ethereum) })
    : createWalletClient({ chain: { id: chainId, name: 'env', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: { default: { http: [rpcUrl] } } } as any, transport: http(rpcUrl) });
  const dataNft = { address: getDataNftAddress(), abi: dataNftAbi } as const;
  return { publicClient, walletClient, dataNft };
}

export async function readLastTokenId(): Promise<bigint> {
  const { publicClient, dataNft } = getClients();
  const toBlock = await publicClient.getBlockNumber();
  const logs = await publicClient.getLogs({ address: dataNft.address, fromBlock: 0n, toBlock });
  if (!logs.length) return 0n;
  const transferTopic0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const minted = (logs as any[]).filter((l) => (l.topics?.[0] || '').toLowerCase() === transferTopic0 && (l.topics?.[1] || '').endsWith('0'.repeat(64)));
  if (!minted.length) return 0n;
  const last = minted[minted.length - 1];
  return BigInt(last.topics[3]);
}

export async function readDataset(tokenId: bigint): Promise<{ owner: Address } & DatasetMeta> {
  const { publicClient, dataNft } = getClients();
  const [meta, owner] = await Promise.all([
    publicClient.readContract({ address: dataNft.address, abi: dataNft.abi, functionName: 'getDataset', args: [tokenId] }) as Promise<DatasetMeta>,
    publicClient.readContract({ address: dataNft.address, abi: dataNft.abi, functionName: 'ownerOf', args: [tokenId] }) as Promise<Address>,
  ]);
  return { owner, ...meta };
}

// Note: These functions are now just helpers - the actual contract calls should be made using wagmi hooks
// in the React components (useWriteContract, useReadContract)

export async function readRecentTokenIds(limit: number): Promise<bigint[]> {
  const { publicClient, dataNft } = getClients();
  const toBlock = await publicClient.getBlockNumber();
  const logs = await publicClient.getLogs({ address: dataNft.address, fromBlock: 0n, toBlock });
  const transferTopic0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const ZERO32 = '0x' + '0'.repeat(64);
  const minted = (logs as any[]).filter((l) => (l.topics?.[0] || '').toLowerCase() === transferTopic0 && (l.topics?.[1] || '').toLowerCase() === ZERO32);
  return minted.map((l) => BigInt(l.topics[3])).slice(-limit);
}

