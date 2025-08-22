'use client';

import { isAddress, createPublicClient, http, type Address, type Hash } from 'viem';
import { dataNftAbi } from './abis/DataNFT';
import { chain } from './wagmi';

export { dataNftAbi };

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
  if (!addr) {
    throw new Error('NEXT_PUBLIC_DATANFT_ADDRESS is not set. Add it to frontend/.env.local');
  }
  if (!isAddress(addr)) {
    throw new Error(`Invalid NEXT_PUBLIC_DATANFT_ADDRESS: ${addr}`);
  }
  return addr as Address;
}

// Default storage gateway
export function getStorageGateway(): string {
  return process.env.NEXT_PUBLIC_STORAGE_GATEWAY || 'https://ipfs.io/ipfs/';
}

// Local public client for non-hook utilities (reads, logs)
export const publicClient = createPublicClient({
  chain,
  transport: http(chain.rpcUrls.default.http[0]),
});

export async function readDataset({ tokenId }: { tokenId: bigint }) {
  const address = getDataNftAddress();
  return publicClient.readContract({ address, abi: dataNftAbi, functionName: 'getDataset', args: [tokenId] }) as Promise<DatasetMeta>;
}

export async function readOwnerOf({ tokenId }: { tokenId: bigint }) {
  const address = getDataNftAddress();
  return publicClient.readContract({ address, abi: dataNftAbi, functionName: 'ownerOf', args: [tokenId] }) as Promise<Address>;
}

export function writeMint({ to, meta }: { to: Address; meta: DatasetMeta }) {
  const address = getDataNftAddress();
  return {
    address,
    abi: dataNftAbi,
    functionName: 'mint' as const,
    args: [to, meta] as const,
  };
}

export function writeSetVerified({ tokenId, value }: { tokenId: bigint; value: boolean }) {
  const address = getDataNftAddress();
  return {
    address,
    abi: dataNftAbi,
    functionName: 'setVerified' as const,
    args: [tokenId, value] as const,
  };
}

// Scan Transfer logs to get recent tokenIds (mint mints from 0x0 -> to)
export async function readRecentTokenIds(limit: number): Promise<bigint[]> {
  const address = getDataNftAddress();
  const toBlock = await publicClient.getBlockNumber();
  const logs = await publicClient.getLogs({ address, fromBlock: 0n, toBlock });
  const TRANSFER_TOPIC0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const ZERO32 = '0x' + '0'.repeat(64);
  const minted = logs.filter((l: any) => (l.topics?.[0] || '').toLowerCase() === TRANSFER_TOPIC0 && (l.topics?.[1] || '').toLowerCase() === ZERO32);
  const ids = minted.map((l: any) => BigInt(l.topics[3])).filter((v: any) => typeof v === 'bigint');
  return ids.slice(-limit);
}

export type { Address, Hash };

