'use client';

import { isAddress } from 'viem';
import type { Address } from 'viem';
import { dataNftAbi } from './abis/DataNFT';

export { dataNftAbi };

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

export type { Address };


